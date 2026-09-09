// providers/SocketProvider.tsx
"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  ReactNode,
} from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}/post`, {
      withCredentials: true,
      transports: ["websocket"],
    });

    const handleConnect = () => {
      setSocket(newSocket);
      setIsConnected(true);
    };

    newSocket.on("connect", handleConnect);
    newSocket.on("disconnect", () => setIsConnected(false));

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect");
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
}