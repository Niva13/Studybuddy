"use client";
import { useEffect } from "react";
import axios from "axios";

const useFetchLastMessages = ({ userID, refreshDeps = [], setLastMessages }) => {
  useEffect(() => {
    const fetchLastMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:9090/api/messages/last/${userID}`);
        setLastMessages(res.data.latestMessages || []);
      } catch (err) {
        console.error("Error fetching last messages", err);
      }
    };

    if (userID) {
      fetchLastMessages();
    }
  }, [userID, ...refreshDeps]);
};

export default useFetchLastMessages;
