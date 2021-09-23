const functions = require("firebase-functions");
const Filter = require('bad-words');
const admin = require('firebase-admin');

admin.initializeApp();  // We don't have to pass our config info b/c Firebase sets up server-side environment variables for us when using the admin SDK
const db = admin.firestore();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});


exports.detectEvilUsers = functions.firestore
    .document('messages/{msgId}')
    .onCreate(async (doc, ctx) => {
        const filter = new Filter();
        const { text, uid } = doc.data();

        if (filter.isProfane(text)) {
            const cleanedText = filter.clean(text);
            await doc.ref.update({text: `🤐  I got BANNED for life for saying... "${cleanedText}"`});
            
            await db.collection('banned').doc(uid).set({});
        }
    });

exports.deleteMessagesOver4000Chars = functions.https.onRequest(async (req, res) => {
    functions.logger.info("Thanks for calling deleteMessagesOver4000Chars()");
    functions.logger.info(req.params);
    
    const messagesRef = db.collection('messages');
    const querySnapshot = await messagesRef.get();

    querySnapshot.forEach(async (docSnapshot) => {
        // functions.logger.info(doc.data());
        if (docSnapshot.data().text.length > 4000) {
            // functions.logger.info("I'm about to delete a message with more than 4000 characters: ");
            // functions.logger.info(doc.data());            

            // We need to use the .doc() method because we need a DocumentRerence object (I think, double-check documentation) in order to delete a doc.
            //  I could not find a way in the documentation to use the DocumentSnapshot (or whatever it's called) to delete the doc.
            const writeResult = await db.doc('messages/' + docSnapshot.id).delete(); 
            functions.logger.info(writeResult);
        }
    });
    res.send("deleteMessagesOver4000Chars() ending");
});