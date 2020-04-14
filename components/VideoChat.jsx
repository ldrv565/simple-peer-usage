/* eslint-disable no-alert */
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import io from 'socket.io-client';
import SimpleSignalClient from 'simple-signal-client';

import StreamVideo from './StreamVideo';
import Layout from './Layout';

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

const VideoChat = ({ currentRoom, client, setCurrentRoom }) => {
  const [signalClient] = useState(() => client || initSignalClient());
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
    signalClient.discover({ roomID: currentRoom });
  }, []);

  useEffect(() => {
    if (localStream) {
      signalClient.on('request', request =>
        request.accept().then(({ peer }) => connectToPeer(peer))
      );

      signalClient.on('discover', ({ peerID }) =>
        signalClient
          .connect(peerID, currentRoom)
          .then(({ peer }) => connectToPeer(peer))
          .catch(error => {
            if (error) {
              signalClient.discover({ remove: currentRoom });
              setCurrentRoom(null);
            }
          })
      );
    }
  }, [localStream]);

  return (
    <Layout>
      <StreamVideo muted autoPlay srcObject={localStream} />
      {remoteStream && <StreamVideo muted autoPlay srcObject={remoteStream} />}
    </Layout>
  );
};

VideoChat.propTypes = {
  currentRoom: PropTypes.string,
  client: PropTypes.object,
  setCurrentRoom: PropTypes.func
};

export default VideoChat;
