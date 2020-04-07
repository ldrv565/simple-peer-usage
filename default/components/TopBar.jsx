import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import styled from 'styled-components';
import { AstralMedLogo } from 'public/icons';
import Avatar from '@material-ui/core/Avatar';

const TopBar = () => {
  return (
    <AppBarStyled position="static">
      <Toolbar>
        <LogoWrapper>
          <AstralMedLogoStyled />
          <LogoTitle>Астрал.МЕД</LogoTitle>
        </LogoWrapper>
        <ProfileWrapper>
          <ProfileName>Сергеев П.В.</ProfileName>
          <Avatar>H</Avatar>
        </ProfileWrapper>
      </Toolbar>
    </AppBarStyled>
  );
};

export default TopBar;

const AppBarStyled = styled(AppBar)`
  background: white;
`;

const AstralMedLogoStyled = styled(AstralMedLogo)`
  margin-right: 10px;
`;

const LogoTitle = styled.h3`
  color: ${({ theme }) => theme.palette.primary.main};
`;

const LogoWrapper = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const ProfileWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ProfileName = styled.p`
  color: ${({ theme }) => theme.palette.primary.main};
  margin-right: 10px;
`;
