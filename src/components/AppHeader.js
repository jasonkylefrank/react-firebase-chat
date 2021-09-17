import styled from "styled-components";

const Header = styled.header`
  text-align: center;
  margin: 36px;
`;

const HeaderStrikethrough = styled.span`
  text-decoration: line-through;
  opacity: 0.5;
`;

export default function AppHeader() {
  return (
    <Header>
      <h1>
        Super <HeaderStrikethrough>chat</HeaderStrikethrough> cat!
      </h1>
    </Header>
  );
}