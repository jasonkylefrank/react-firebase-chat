import styled, { css } from 'styled-components';

const MessageBase = styled.div`
    display: inline-flex;
    border-radius: 36px;
    padding: 8px 20px 8px 8px;
    align-items: center;
`;

const ReceivedMessage = styled(MessageBase)`
    background-color: pink;
`;
const LocalUserMessage = styled(MessageBase)`
    ${'' /* Greenish */}
    background-color: rgba(50, 200, 50, 0.15);
    flex-direction: row-reverse;
    padding-left: 20px;
    padding-right: 8px;
`;

const MessageContainer = styled.div`
    display: flex;
    margin-bottom: 24px;
    justify-content: ${({isLocalUserMessage}) => isLocalUserMessage ? 'flex-end' : 'flex-start'};
`;

// For some reason it seems we have to define it out here
const localUserAvatarMargin = css`
    margin-left: 12px;
`;
const remoteUserAvatarMargin = css`
    margin-right: 12px
`;

const AvatarImg = styled.img`
    width: 40px;
    border-radius: 100%;
    ${({isLocalUserMessage}) => (isLocalUserMessage ? localUserAvatarMargin : remoteUserAvatarMargin)}
`;

export default function ChatMessage({data, auth}) {
    const { uid, photoURL } = data;
    const isLocalUserMessage = auth.currentUser.uid === uid;

    const chatContents = 
        <>
            <AvatarImg src={photoURL} alt="Avatar" isLocalUserMessage={isLocalUserMessage} />
            <p>{data.text}</p>
        </>;

    const messageComponent 
            = isLocalUserMessage 
                ? <LocalUserMessage>{chatContents}</LocalUserMessage>
                : <ReceivedMessage>{chatContents}</ReceivedMessage>

    return (
        <MessageContainer isLocalUserMessage={isLocalUserMessage}>
            {messageComponent}
        </MessageContainer>
    );
}