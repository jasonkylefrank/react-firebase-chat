import styled from 'styled-components';

const MessageBase = styled.div`
    border-radius: 36px;
    padding: 8px 20px 8px 8px;
    display: flex;
    align-items: center;
    margin-bottom: 24px;
`;

const ReceivedMessage = styled(MessageBase)`
    background-color: pink;
`;
const LocalUserMessage = styled(MessageBase)`
    ${'' /* Greenish */}
    background-color: rgba(50, 200, 50, 0.15);
`;

const AvatarImg = styled.img`
    margin-right: 12px;
    width: 40px;
    border-radius: 100%;
`;

export default function ChatMessage({data, auth}) {
    const { uid, photoURL } = data;
    const isLocalUserMessage = auth.currentUser.uid === uid;

    const chatContents = 
        <>
            <AvatarImg src={photoURL} alt="Avatar" />
            <p>{data.text}</p>
        </>;

    const component = isLocalUserMessage 
                        ? <LocalUserMessage>{chatContents}</LocalUserMessage>
                        : <ReceivedMessage>{chatContents}</ReceivedMessage>

    return (
        component
    );
}