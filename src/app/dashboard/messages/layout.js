"use client";
import { useEffect, useState } from "react";
import api from "@/utilities/api";
import { useUser } from "@/context/User";
import { io } from "socket.io-client";
export const socket = io(
  process.env.NEXT_PUBLIC_Server_URL?.split("/api")?.[0],
  {
    transports: ["websocket"],
    autoConnect: true,
  }
);
export default function MessagesLayout({ children }) {
  const {
    user: { id },
  } = useUser();

  useEffect(() => {
    socket.emit(
      "register",
      {
        UserID: id,
      },
      (response) => {
        console.log("Registration response:", response);
      }
    );

    return () => {
      console.log("Disconnecting from socket server...");
      socket.emit("diconnect", { UserID: id }, (response) => {
        console.log("Disconnection response:", response);
      });
    };
  }, [id]);
  return <>{children}</>;
}
