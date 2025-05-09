// contexts/SocketContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ 
  children,
  storeId 
}: { 
  children: React.ReactNode;
  storeId: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket instance
    const socketInstance = io(process.env.NEXT_PUBLIC_NOTIFICATION_SERVER_URL || "http://localhost:3001", {
      transports: ["websocket"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Handle connection events
    socketInstance.on("connect", () => {
      console.log("Client Frontend Socket connected:", socketInstance.id);
      setIsConnected(true);
      
      // Subscribe to store-specific events
      socketInstance.emit("subscribe-to-store", storeId);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket disconnected");
      setIsConnected(false);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    socketInstance.on("connect_error", (error: any) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    socketInstance.onAny((event, ...args) => {
      console.log(`[Socket Debug] Received event: ${event}`, args);
    });

    // Set the socket instance
    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [storeId]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};