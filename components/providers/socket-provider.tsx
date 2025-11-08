"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "@/lib/hooks/use-app-selector";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  getSocket: () => Socket | null;
}

const SocketContext = createContext<SocketContextType | null>(null);

export default function SocketProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { accessToken, isAuthenticated } = useAppSelector((s) => s.auth);
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const cleanupSocket = useCallback(() => {
    const s = socketRef.current;
    if (!s) return;
    s.removeAllListeners();
    s.disconnect();
    socketRef.current = null;
  }, []);

  const initSocket = useCallback((token: string) => {
    if (!token) return null;
    const url = process.env.NEXT_PUBLIC_SOCKET_URL as string;
    const s = io(url, {
      auth: { token },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelayMax: 5000,
      autoConnect: true,
    });

    s.on("connect", () => setIsConnected(true));
    s.on("disconnect", () => setIsConnected(false));
    s.on("connect_error", () => setIsConnected(false));

    socketRef.current = s;
    return s;
  }, []);

  const connect = useCallback(() => {
    if (!isAuthenticated || !accessToken) return;
    if (socketRef.current && socketRef.current.connected) return;
    const s = initSocket(accessToken);
    if (s) {
      setTimeout(() => setSocket(s), 0);
    }
  }, [accessToken, isAuthenticated, initSocket]);

  const disconnect = useCallback(() => {
    setTimeout(() => {
      cleanupSocket();
      setIsConnected(false);
      setSocket(null);
    }, 0);
  }, [cleanupSocket]);

  const getSocket = useCallback(() => socketRef.current, []);

  useEffect(() => {
    if (isAuthenticated && accessToken) {
      connect();
    } else {
      disconnect();
    }
  }, [accessToken, isAuthenticated, connect, disconnect]);

  const value = useMemo(
    () => ({ socket, isConnected, connect, disconnect, getSocket }),
    [socket, isConnected, connect, disconnect, getSocket]
  );

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within SocketProvider");
  return ctx;
}
