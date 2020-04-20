import React from 'react';
import styled from 'styled-components';

const AuthLayout = ({ children }) => {
  return (
    <Page>
      <Wrap>
        <Header>
          {/*<LogoStyled />*/}
          <Title>АРМ МЕД</Title>
          <Desc>Инновационная медицинская система</Desc>
        </Header>

        <Content>{children}</Content>

        <Footer>
          <Support>Техническая поддержка</Support>
          <br />
          <Phone>8 800 700-86-68</Phone>
        </Footer>
      </Wrap>
    </Page>
  );
};

const Page = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  // background: ${({ theme }) =>
    theme.palette.background.primary} url(${Bg}) left
  //   center / auto auto no-repeat;
  overflow: hidden;
  @media (min-width: 768px) {
    background-size: auto 100%;
    background-position: center center;
  }
  @media (min-width: 1366px) {
    background-position: right center;
  }
`;

const Wrap = styled.section`
  width: 348px;
  margin: 0 auto;
  @media (min-width: 1366px) {
    margin-left: 86px;
  }
`;

const Header = styled.header`
  margin-bottom: 30px;
  text-align: center;
`;

// const LogoStyled = styled(Logo)`
//   width: 48px;
//   height: 48px;
//   margin: 0 auto 12px;
// `;

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: 2rem;
  font-weight: 600;
  line-height: 39px;
  letter-spacing: 0.2em;
`;

const Desc = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.palette.primary.main};
  font-size: 0.8rem;
  font-weight: 400;
  line-height: 15px;
`;

const Content = styled.div`
  margin-bottom: 30px;
  padding: 32px 32px 24px;
  background: white;
  box-shadow: 0px 4px 25px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  overflow: hidden;
`;

const Footer = styled.footer`
  text-align: center;
`;

const Support = styled.span`
  margin-bottom: 8px;
  color: ${({ theme }) => theme.palette.text.secondary};
  font-size: 0.8rem;
`;

const Phone = styled.span`
  color: ${({ theme }) => theme.palette.text.primary};
  font-size: 1rem;
`;

export default AuthLayout;
