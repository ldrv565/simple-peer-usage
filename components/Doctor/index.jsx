/* eslint-disable no-alert */
import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

import io from 'socket.io-client';
import SimpleSignalClient from 'simple-signal-client';

import { MenuItem } from '@material-ui/core';

import StreamVideo from '../StreamVideo';

import Layout from '../Layout';

const isDev = process.env.NODE_ENV !== 'production';

const initSignalClient = () =>
  new SimpleSignalClient(
    io(isDev ? 'localhost:4000' : 'chat.m.astral-dev.net')
  );

const getLocalStream = async () =>
  navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true
    })
    .catch(() => {
      alert('Включите камеру и нажмите ОК');
      return getLocalStream();
    });

const DoctorPage = () => {
  const [signalClient] = useState(() => initSignalClient());
  const [rooms, setRooms] = useState([]);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const connectToPeer = useCallback(
    peer => {
      peer.addStream(localStream);
      peer.on('stream', stream => setRemoteStream(stream));
      peer.on('close', () => setRemoteStream());
    },
    [localStream]
  );

  useEffect(() => {
    getLocalStream().then(stream => setLocalStream(stream));
  }, []);

  useEffect(() => {
    if (!currentRoom) {
      signalClient.discover(null);
      signalClient.on('discover', ({ rooms: newRooms }) => setRooms(newRooms));
    }

    if (currentRoom) {
      signalClient.discover({ roomID: currentRoom });

      signalClient.on('request', request =>
        request.accept().then(({ peer }) => connectToPeer(peer))
      );

      signalClient.on('discover', ({ peerID }) => {
        signalClient
          .connect(peerID, currentRoom)
          .then(({ peer }) => connectToPeer(peer))
          .catch(error => {
            if (error) {
              signalClient.discover({ remove: currentRoom });
              setCurrentRoom(null);
            }
          });
      });
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
        currentRoom
      )}
      <StreamVideo muted autoPlay srcObject={localStream} />
      {remoteStream && <StreamVideo muted autoPlay srcObject={remoteStream} />}
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
