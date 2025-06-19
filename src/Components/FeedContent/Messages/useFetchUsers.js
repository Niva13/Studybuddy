"use client";

import { useEffect } from "react";
import axios from "axios";

const useFetchUsers = ({
  userID,
  appUsername,
  lastMessages,
  refreshDeps = [],
  setAllUsers,
  setFilteredUsers,
}) => {
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.post("http://localhost:9090/api/users", {
          command: "getAllUsers",
          data: { userID },
        });

        const otherUsers = res.data.users.filter((u) => u.appUsername !== appUsername);

        setAllUsers(otherUsers);
        setFilteredUsers(otherUsers);

        const usersInConversation = new Set(
          lastMessages.map((msg) =>
            msg.Sender === userID ? msg.receiver : msg.Sender
          )
        );

        const filtered = otherUsers.filter((u) => !usersInConversation.has(u.userID));
        setFilteredUsers(filtered);
      } catch (err) {
        console.error("Error fetching users", err);
      }
    };

    if (userID && appUsername) {
      fetchUsers();
    }
  }, [userID, appUsername, lastMessages, ...refreshDeps]);
};

export default useFetchUsers;
