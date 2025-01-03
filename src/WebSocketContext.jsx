import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const WebSocketContext = createContext(null);

export function WebSocketProvider({ children }) {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io('http://localhost:3000', {
      transports: ['websocket'],
      upgrade: false,
      reconnectionAttempts: 5,
      timeout: 10000,
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket');
    });

    newSocket.on('connect_error', (err) => {
      console.error('Connection error:', err);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  return useContext(WebSocketContext);
}

