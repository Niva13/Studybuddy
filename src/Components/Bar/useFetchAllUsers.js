"use client";

import { useEffect, useState } from 'react';
import axios from 'axios';

const useFetchAllUsers = (userID) => {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.post("http://localhost:9090/api/users", {
          command: "getAllUsers",
          data: { userID },
        });
        setAllUsers(res.data.users || []);
      } catch (err) {
        console.log("Error fetching users: " + err.message);
      }
    };

    if (userID) {
      fetchUsers();
    }
  }, [userID]);

  return allUsers;
};

export default useFetchAllUsers;
