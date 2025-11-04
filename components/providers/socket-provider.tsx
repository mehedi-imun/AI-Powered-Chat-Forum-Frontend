"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/lib/hooks/use-app-selector";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const { accessToken, isAuthenticated } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Only connect if user is authenticated
    if (!isAuthenticated || !accessToken) {
      // Disconnect existing socket if user logs out
      if (socketRef.current) {
        console.log("🔌 Disconnecting socket due to logout");
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Don't create a new socket if one already exists
    if (socketRef.current?.connected) {
      console.log("♻️  Reusing existing socket connection");
      return;
    }

    // Create socket connection
    const socketUrl =
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000";

    console.log("🔌 Creating new Socket.IO connection...");
    const socketInstance = io(socketUrl, {
      auth: {
        token: accessToken,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("✅ Socket.IO connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("❌ Socket.IO disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("connect_error", (error) => {
      console.error("🔴 Socket.IO connection error:", error.message);
      setIsConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("🔴 Socket.IO error:", error);
    });

    // Reconnection handlers
    socketInstance.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket.IO reconnected after", attemptNumber, "attempts");
      setIsConnected(true);
    });

    socketInstance.on("reconnect_attempt", (attemptNumber) => {
      console.log("🔄 Socket.IO reconnection attempt:", attemptNumber);
    });

    socketInstance.on("reconnect_failed", () => {
      console.error("🔴 Socket.IO reconnection failed");
      setIsConnected(false);
    });

    // Store socket instance in both ref and state
    socketRef.current = socketInstance;
    setSocket(socketInstance);

    // Cleanup only on unmount or auth change
    return () => {
      if (socketRef.current) {
        console.log("🧹 Cleaning up Socket.IO connection");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [accessToken, isAuthenticated]);
  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};
