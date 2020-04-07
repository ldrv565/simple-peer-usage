import React, { useEffect } from 'react';
import styled from 'styled-components';

import io from 'socket.io-client';
import SimpleSignalClient from 'simple-signal-client';

import { MenuItem } from '@material-ui/core';

import Layout from '../Layout';

const isDev = process.env.NODE_ENV !== 'production';

const DoctorPage = () => {
  useEffect(() => {
    const roomContainer = document.getElementById('list');
    const localVideoContainer = document.getElementById('localVideo');
    const remoteVideoContainer = document.getElementById('remoteVideos');

    // creates a DOM element to allow the user to see/join rooms
    function createRoomElement(id) {
      const element = document.createElement('div');
      element.className = 'el';
      element.id = id;
      element.innerHTML = id;
      roomContainer.appendChild(element);
      return element;
    }

    // creates a video element, sets a mediastream as it's source, and appends it to the DOM
    function createVideoElement(container, mediaStream, muted = false) {
      const videoElement = document.createElement('video');
      videoElement.autoplay = true;
      videoElement.srcObject = mediaStream;
      videoElement.muted = muted;
      container.appendChild(videoElement);
      return videoElement;
    }

    const socket = io(
      isDev ? 'localhost:4000' : 'socket.ldrv-project.appspot.com'
    );
    const signalClient = new SimpleSignalClient(socket); // construct the signal client
    let currentRoom = null; // keeps track of current room

    function onPeer(peer, localStream) {
      peer.addStream(localStream);
      peer.on('stream', remoteStream => {
        const videoElement = createVideoElement(
          remoteVideoContainer,
          remoteStream
        );
        peer.on('close', () => {
          remoteVideoContainer.removeChild(videoElement);
        });
      });
    }

    // connects to a peer and handles media streams
    async function connectToPeer(peerID, localStream) {
      console.log('connecting to peer', peerID);
      const { peer } = await signalClient.connect(peerID, currentRoom); // connect to the peer
      console.log('connected to peer', peerID);
      onPeer(peer, localStream);
    }

    function joinRoom(roomID, localStream) {
      console.log('join', roomID);
      // disconnect from all peers in old room
      if (currentRoom) {
        if (currentRoom !== roomID) {
          signalClient.peers().forEach(peer => {
            peer.destroy();
          });
        } else {
          return;
        }
        const currentRoomElement = document.getElementById(roomID);
        currentRoomElement.style.backgroundColor = '';
      }
      currentRoom = roomID; // update current room
      const currentRoomElement = document.getElementById(roomID);
      currentRoomElement.style.backgroundColor = 'lime';
      console.log('requesting to join', roomID);
      signalClient.discover(roomID);

      // get the peers in this room
      function onRoomPeers(discoveryData) {
        if (discoveryData.roomResponse === roomID) {
          console.log(discoveryData);
          signalClient.removeListener('discover', onRoomPeers);
          discoveryData.peers.forEach(peerID =>
            connectToPeer(peerID, localStream)
          ); // connect to all peers in new room
        }
      }
      signalClient.addListener('discover', onRoomPeers);
    }

    // request local webcam
    navigator.getUserMedia(
      { audio: true, video: true },
      localStream => {
        createVideoElement(localVideoContainer, localStream, true); // display local video
        signalClient.discover(null); // begin discovering rooms

        signalClient.on('request', async request => {
          const { peer } = await request.accept();
          onPeer(peer, localStream);
        });

        // listen for discovery's completion
        signalClient.once('discover', discoveryData => {
          // discovery provides a list of rooms, show them to the user
          console.log(discoveryData);
          discoveryData.rooms.forEach(roomID => {
            const roomElement = createRoomElement(roomID); // create a DOM element for each room
            roomElement.addEventListener('click', () =>
              joinRoom(roomID, localStream)
            ); // register a click handler to join room
          });
        });
      },
      () => alert('No webcam access!')
    );
  }, []);

  return (
    <Layout>
      <List>
        <MenuItemStyled>simple-peer</MenuItemStyled>
        <MenuItemStyled>simple-peer</MenuItemStyled>
        <MenuItemStyled>simple-peer</MenuItemStyled>
      </List>

      <div id="list" />
      <div id="localVideo" />
      <div id="remoteVideos" />
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
