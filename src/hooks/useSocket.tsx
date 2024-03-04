import socket from 'configs/socket';
import React, { createContext, useContext, useEffect } from 'react';
import { Socket } from 'socket.io-client';

const SocketContext = createContext<Socket | undefined>(undefined);

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};
