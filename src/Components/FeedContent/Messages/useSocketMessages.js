"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

const useSocketMessages = ({ userID, setLastMessages, setRefreshFlagSokcket, socket }) => {
  useEffect(() => {
    if (!userID) return;

    socket.current = io("http://localhost:9090");

    socket.current.emit("join", userID);

    socket.current.on("receiveMessage", (msg) => {
      const otherUser = msg.Sender === userID ? msg.receiver : msg.Sender;

      setLastMessages((prevMessages) => {
        const filtered = prevMessages.filter(
          (m) => m.Sender !== otherUser && m.receiver !== otherUser
        );
        return [msg, ...filtered];
      });

      setRefreshFlagSokcket((prev) => !prev);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userID]);
};

export default useSocketMessages;
