import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { signOut } from 'firebase/auth';
import { collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp } from 'firebase/firestore';
//import { useCollectionData } from 'react-firebase-hooks/firestore';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import ChatMessage from './ChatMessage';

const SignOutButton = styled(Button)`
    margin-top: 72px;
`;

const MessageTextField = styled(TextField)`
    margin-right: 16px;
    flex-grow: 1;
`;
const SendButton = styled(Button)`
    background-color: rgba(25,118,210, 0.1);
    font-size: 26px;
`;
const Form = styled.form`
    display: flex;
    align-items: stretch;
    width: 100%;
    margin-top: 40px;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(100vw - 48px);
    max-width: 460px;
    padding: 12px 24px;
`;

const MessagesContainer = styled.div`
    width: 100%;
`;


export default function ChatRoom({auth, db}) {
    const logOut = () => signOut(auth);

    const [messages, setMessages] = useState([]);
    const [formValue, setFormValue] = useState("");
    const scrollElementRef = useRef();
    
    
    // ----------- Get changes in realtime -----------
    /*
        I'm punting on this useCollectionData approach for now.

        It appears that as of 9/17/21 the React Firebase Hooks library DOES NOT YET WORK WITH THE FIREBASE v9 API.
         I'm getting errors on these calls.  And their repo (which is not by Google, by the way) has several repo 
         issues asking when they will support v9.
      
        // const [messages] = useCollectionData(messagesRef, { idField: 'id' });
        // const [messages] = useCollectionData(q, { idField: 'id' });  
    */  

    useEffect(() => {
        // --- FIRESTORE: Get changes in realtime ---

        const messagesRef = collection(db, 'messages');
        // v9 API note: the ref returned by collection() is a type that extends Query. So this call to query() works.
        //const q = query(messagesRef, orderBy('createdAt'), limit(25));
        const q = query(messagesRef, orderBy('createdAt'));


        // --- APPROACH 1: Subscribe to a query (without accessing the type of change of each doc)
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            //querySnapshot.forEach((doc) => console.log('Doc: ', doc.data()));
            const dbMessages = [];

            querySnapshot.forEach((doc) => {
                console.log('Doc: ', doc.data());
                dbMessages.push({
                    ...doc,
                    //  We have to call .data() explicitly here b/c it is an inherited property of the doc and thus
                    //    does not get copied to the new object via the spread operator.
                    data: doc.data(),
                    //  We have to access id explicitly here b/c it is a getter on the source object and thus would
                    //    not get copied over via the spread operator.
                    id: doc.id
                })
            });
            setMessages(dbMessages);
        });
    
    
        // --- APPROACH 2: Subscribing and accessing the type of change for each doc ("added", "modified", "removed")
        // #region
        // const unsubscribe = onSnapshot(q, (querySnapshot) => {
        //     const docChanges = querySnapshot.docChanges();
        //     docChanges.forEach((change) => {            
        //         console.log('Changed doc: ', change.doc.data());
        //         console.log('   Change type: ', change.type);
        //     });
        //     const dbMessages = docChanges.map((changedDoc) => { 
        //         return {
        //             ...changedDoc.doc,
        //             //  We have to call .data() explicitly here b/c it is an inherited property of the doc and thus
        //             //    does not get copied to the new object via the spread operator.
        //             data: changedDoc.doc.data(),
        //             //  We have to access id explicitly here b/c it is a getter on the source object and thus would
        //             //    not get copied over via the spread operator.
        //             id: changedDoc.doc.id,
        //             updateType: changedDoc.type
        //         };
        //     });
        //     setMessages(dbMessages);
        // });    
        // #endregion
        return () => {
            unsubscribe();
        }
    }, [db])

    const handleTextFieldChange = (e) => setFormValue(e.target.value);

    const sendMessage = async (e) => {
        e.preventDefault();

        const { uid, photoURL } = auth.currentUser;

        const messagesRef = collection(db, 'messages');
        await addDoc(messagesRef, {
            createdAt: serverTimestamp(),
            uid,
            text: formValue,
            photoURL
        });

        setFormValue('');
        scrollElementRef.current.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <Container>
            <MessagesContainer>
                {
                    messages.map(msg => 
                        <ChatMessage key={msg.id} data={msg.data} auth={auth} />
                    )
                }
                <div ref={scrollElementRef} />
            </MessagesContainer>

            <Form onSubmit={sendMessage}>
                <MessageTextField value={formValue} onChange={handleTextFieldChange} type="text" />

                <SendButton variant="outlined" type="submit">😽</SendButton>
            </Form>

            {
                auth.currentUser && <SignOutButton onClick={logOut}>Sign out</SignOutButton>
            }
        </Container>
    );
}