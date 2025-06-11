"use client"

import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';




import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import ForumIcon from '@mui/icons-material/Forum';

const MessagesButton = ({userID,  onClick }) => {


  const [unreadCount, setUnreadCount] = useState(0);
  const socket = useRef(null);


  /*useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await axios.post("http://localhost:9090/api/messages/unreadMessages", {
          receiverID: userID,
        });
        setUnreadCount(res.data.unreadMessages);
      } catch (err) {
        console.error("Error fetching unread messages count", err);
      }
    };

    if (userID) {
      fetchUnread();
    }
  }, [userID]);*/




  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.post("http://localhost:9090/api/messages/unreadMessages", {
          receiverID: userID,
        });
        setUnreadCount(res.data.unreadMessages);
      } catch (err) {
        console.error("Error fetching unread count periodically", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [userID]);






  



  return(
    <IconButton size="large" aria-label="show messages" color="inherit" onClick={onClick}>
      <Badge badgeContent={unreadCount} color="error">
        <ForumIcon />
      </Badge>
    </IconButton>
  );
};

export default MessagesButton;
