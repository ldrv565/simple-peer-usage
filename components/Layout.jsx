import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Layout = ({ children }) => (
  <Container>
    <Main>{children}</Main>
  </Container>
);

Layout.propTypes = {
  children: PropTypes.any
};

export default Layout;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ theme }) => theme.palette.background.primary};
  border-radius: 8px;
  height: 100vh;
`;

const Main = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: ${({ theme }) => theme.palette.background.secondary};
  padding: 24px;
  border-radius: 8px;
`;
