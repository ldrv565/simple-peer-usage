import React from 'react';
import styled from 'styled-components';
import { MenuItem } from '@material-ui/core';

import Layout from '../Layout';

const DoctorPage = () => {
  return (
    <Layout>
      <List>
        <MenuItemStyled>simple-peer</MenuItemStyled>
        <MenuItemStyled>simple-peer</MenuItemStyled>
        <MenuItemStyled>simple-peer</MenuItemStyled>
      </List>
    </Layout>
  );
};

export default DoctorPage;

const MenuItemStyled = styled(MenuItem)`
  &:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
  }
`;

const List = styled.div`
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.palette.divider};
  background: ${({ theme }) => theme.palette.background.secondary};
`;
