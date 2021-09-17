import styled from "styled-components";
import { GoogleAuthProvider, signInWithPopup /*, signInWithRedirect*/ } from "firebase/auth";
import Button from '@mui/material/Button';

const SignInButton = styled(Button)`
    ${'' /* color: green;  */}
    margin-top: 72px;
`;

export default function SignIn({ auth }) {
    const provider = new GoogleAuthProvider();

    const signInWithGoogle = () => {
        signInWithPopup(auth, provider);
        // The redirect sign-in approach is preferrable on mobile devices.
        //signInWithRedirect(auth, provider);
    };

    return (
        <SignInButton onClick={signInWithGoogle}>Sign in with Google</SignInButton>
    );
}