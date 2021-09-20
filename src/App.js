import styled from 'styled-components';

import { initializeApp } from 'firebase/app';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';

import { useAuthState } from 'react-firebase-hooks/auth';

import AppHeader from './components/AppHeader';
import SignIn from './components/SignIn';
import ChatRoom from './components/ChatRoom';


//#region --- Styled components ---
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

//#endregion ---

//#region --- Firebase setup ---

const firebaseConfig = {
  apiKey: "AIzaSyAhN4I1rJek11x2hv5tF2lPp9MIvmCqfBg",
  authDomain: "react-firebase-chat-e520e.firebaseapp.com",
  projectId: "react-firebase-chat-e520e",
  storageBucket: "react-firebase-chat-e520e.appspot.com",
  messagingSenderId: "281666476748",
  appId: "1:281666476748:web:34661b9894a1fe5eb30069",
  measurementId: "G-MLDBMTXQ8B"
};

const firebaseApp = initializeApp(firebaseConfig);
getAnalytics(firebaseApp);
// const db = getFirestore(firebaseApp);

// --- Connect to emulated Firestore ---
const db = getFirestore();
connectFirestoreEmulator(db, 'localhost', 8080);
// --- End emulated Firestore setup ---

const auth = getAuth(firebaseApp);
//#endregion ---


function App() {

  const [user] = useAuthState(auth);

  return (
    <Container>
      <AppHeader />

      <section>
        { user ? <ChatRoom auth={auth} db={db} /> : <SignIn auth={auth} /> }
      </section>
    </Container>
  );
}

export default App;
