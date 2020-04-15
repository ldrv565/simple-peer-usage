/* eslint-disable no-alert */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import io from 'socket.io-client';
import SimpleSignalClient from 'simple-signal-client';

import { IconButton, Slider } from '@material-ui/core';
import { VolumeDown, VolumeUp } from '@material-ui/icons';

import { PhoneIcon, MicrophoneIcon } from 'public/icons';

import StreamVideo from './StreamVideo';
import TopBar from './TopBar';

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

const VideoChat = ({ currentRoom, setCurrentRoom }) => {
  const [signalClient] = useState(() => initSignalClient());
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const [value, setValue] = useState(50);
  const onChange = (event, newValue) => setValue(newValue);

  const [muted, setMuted] = useState(false);
  const toggleMuted = () => setMuted(!muted);

  const isDoctor = !!setCurrentRoom;

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
    if (isDoctor) {
      signalClient.discover(null);
    }
  }, []);

  useEffect(() => {
    if (localStream) {
      signalClient.discover({ roomID: currentRoom });

      signalClient.on('request', request =>
        request.accept().then(({ peer }) => connectToPeer(peer))
      );

      signalClient.on('discover', ({ peerID }) =>
        signalClient
          .connect(peerID, currentRoom)
          .then(({ peer }) => connectToPeer(peer))
          .catch(error => {
            if (error) {
              if (isDoctor) {
                signalClient.discover({ remove: currentRoom });
                setCurrentRoom(null);
              }
            }
          })
      );
    }
  }, [localStream]);

  return (
    <Container>
      <TopBar />
      <VideoChatContainer>
        <VideoContainer>
          <Name>{isDoctor ? currentRoom : 'Сергеев П.В.'}</Name>
          {remoteStream ? (
            <RemoteVideo autoPlay srcObject={remoteStream} />
          ) : (
            <LoaderContainer />
          )}
          <LocalVideo muted autoPlay srcObject={localStream} />
          <ToolBar>
            <div>
              <SliderContainer>
                <VolumeDown />
                <Slider value={value} onChange={onChange} />
                <VolumeUp />
              </SliderContainer>
              <IconButtonStyled onClick={toggleMuted}>
                <MicrophoneIcon />
              </IconButtonStyled>
              <DropIconButton onClick={() => setCurrentRoom()}>
                <PhoneIcon />
              </DropIconButton>
            </div>
          </ToolBar>
        </VideoContainer>
      </VideoChatContainer>
    </Container>
  );
};

VideoChat.propTypes = {
  currentRoom: PropTypes.string,
  setCurrentRoom: PropTypes.func
};

export default VideoChat;

const Container = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
`;

const VideoChatContainer = styled.div`
  display: flex;
  flex: 1;
`;

const VideoContainer = styled.div`
  position: relative;
  height: 100%;
  width: min-content;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const LoaderContainer = styled.video`
  width: 60vw;
  height: 100%;
  background: ${({ theme }) => theme.palette.gray.main};

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const RemoteVideo = styled(StreamVideo)`
  height: 100%;
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Name = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  padding: 4px 8px;
  border-radius: 24px;
  margin: 24px;

  background: ${({ theme }) => theme.palette.primary.main};
  color: ${({ theme }) => theme.palette.primary.contrastText};
`;

const LocalVideo = styled(StreamVideo)`
  position: absolute;
  right: 24px;
  bottom: 24px;
  width: 200px;

  @media (max-width: 768px) {
    bottom: unset;
    top: 24px;
  }
`;

// ---------

const ToolBar = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;

  left: 0;
  right: 0;
  bottom: 24px;

  & > div {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
  }
`;

const IconButtonStyled = styled(IconButton)`
  margin: 12px;
  border: 1px solid white;
`;

const DropIconButton = styled(IconButton)`
  margin: 12px;
  border: 1px solid white;
  background: rgba(255, 0, 0, 0.25);
`;

const SliderContainer = styled.div`
  display: flex;
  width: 140px;
  border: 1px solid white;
  padding: 12px;
  border-radius: 100px;
  align-items: center;

  svg {
    margin: 4px;
  }
`;
