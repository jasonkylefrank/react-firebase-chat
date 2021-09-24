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
  min-height: 100vh;
`;

const Main = styled.main`
  flex: 1;
`;

const Footer = styled.footer`
  color: rgba(0,0,0, 0.4);
  font-size: 12px;
  height: 64px;
  display: flex;
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
const db = initializeDB(firebaseApp);

function initializeDB(firebaseApp) {  
    
  const isProduction = process.env.NODE_ENV === "production";
  // The Firebase hosting emulator uses the production code build.  But we want our code
  //  to connect to the Firestore emulator when we're running this locally.  This variable
  //  gives us a way to force the code to connect to the Firestore emulator even when the
  //  NODE_ENV is set to production.
  const forceUseFirestoreEmulator = process.env.REACT_APP_USE_FIRESTORE_EMULATOR;

  if (isProduction && !forceUseFirestoreEmulator) {
    return getFirestore(firebaseApp);
  }
  else {
    // --- Connect to emulated Firestore ---
    const emulatedDB = getFirestore();
    connectFirestoreEmulator(emulatedDB, 'localhost', 8080);
    return emulatedDB;
  }
};

const auth = getAuth(firebaseApp);
//#endregion ---


function App() {

  const [user] = useAuthState(auth);

  return (
    <Container>
      <AppHeader />

      <Main>
        { user ? <ChatRoom auth={auth} db={db} /> : <SignIn auth={auth} /> }
      </Main>
      <Footer>Powered by Firebase technologies</Footer>
    </Container>
  );
}

export default App;
