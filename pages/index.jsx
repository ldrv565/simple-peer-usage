import React from 'react';
import styled from 'styled-components';

import { Doctor, TopBar } from 'components';

const IndexPage = () => {
  return (
    <Wrapper>
      <TopBar />
      <Doctor />
    </Wrapper>
  );
};

export default IndexPage;

const Wrapper = styled.div`
  position: relative;
  height: 100vh;
  overflow: hidden;
`;
