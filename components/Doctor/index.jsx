/* eslint-disable no-alert */
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

import io from 'socket.io-client';
import SimpleSignalClient from 'simple-signal-client';

import { MenuItem } from '@material-ui/core';

import VideoChat from '../VideoChat';

import Layout from '../Layout';

const isDev = process.env.NODE_ENV !== 'production';

const initSignalClient = () =>
  new SimpleSignalClient(
    io(isDev ? 'localhost:4000' : 'chat.m.astral-dev.net')
  );

const DoctorPage = () => {
  const [signalClient] = useState(() => initSignalClient());
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);

  useEffect(() => {
    if (!currentRoom) {
      signalClient.discover(null);
      signalClient.on('discover', ({ rooms: newRooms }) => setRooms(newRooms));
    }
  }, [currentRoom]);

  return (
    <Layout>
      {!currentRoom ? (
        <List>
          {rooms &&
            rooms.map(roomID => (
              <MenuItemStyled
                key={roomID}
                selected={roomID === currentRoom}
                onClick={() => setCurrentRoom(roomID)}
              >
                {roomID}
              </MenuItemStyled>
            ))}
        </List>
      ) : (
        <VideoChat
          currentRoom={currentRoom}
          client={signalClient}
          setCurrentRoom={setCurrentRoom}
        />
      )}
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
