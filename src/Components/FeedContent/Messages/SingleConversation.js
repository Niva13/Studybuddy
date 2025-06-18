"use client";

import { useEffect, useState, useRef } from 'react';
import {
  Paper, Typography, List, ListItem, ListItemText, Avatar,
  ListItemAvatar, IconButton, Box, TextField, Button
} from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import { io } from "socket.io-client";




const SingleConversation = ({ sender, currentUser, onClose, onMessageSent, onRefreshSokcket, onReadMessages  }) => {

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const socket = useRef(null);
  const [hasUpdatedUnread, setHasUpdatedUnread] = useState(false);


  useEffect(() => {
    socket.current = io("http://localhost:9090");
    socket.current.emit("join", currentUser.userID);
    
    // listening to comming messages
    socket.current.on("receiveMessage", (msg) => {
      if (
        (msg.Sender === sender.userID && msg.receiver === currentUser.userID) ||
        (msg.Sender === currentUser.userID && msg.receiver === sender.userID)
      ) {
        setMessages(prev => [...prev, msg]);
        onRefreshSokcket?.();
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [sender, currentUser]);




  useEffect(() => {
  const markMessagesAsRead = async () => {
    try {
      await axios.post("http://localhost:9090/api/messages/markAsRead", {
        senderID: sender.userID,
        receiverID: currentUser.userID,
      });

      onReadMessages?.();
    } catch (err) {
      console.error("error marking messages as read", err);
    }
  };

  const fetchMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:9090/api/messages/${currentUser.userID}/${sender.userID}`);
        setMessages(res.data.messages);
      } catch (err) {
        console.error("error fetching messages", err);
      }
    };
    

  if (sender && currentUser) {
    markMessagesAsRead();
    fetchMessages();
  }
}, [sender, currentUser]);




  const handleSend = async (e) => {

    e.preventDefault();

    if (!newMessage.trim()) return;

    const msgToSend = {
      Sender: currentUser.userID,
      receiver: sender.userID,
      text: newMessage,
      time: new Date().toLocaleString('en-IL', {
        dateStyle: 'medium',
        timeStyle: 'short'
      })
    };

    try {
      const res = await axios.post("http://localhost:9090/api/messages/send", msgToSend);

      socket.current.emit("sendMessage", msgToSend);
      setMessages(prev => [...prev, msgToSend]);
      setNewMessage("");
      setHasUpdatedUnread(true);

      

      onMessageSent?.();

      setTimeout(() => setHasUpdatedUnread(false), 100);
      
    } 
    catch (err) {
      alert("error sending message", err);
    }
  };

  return (
    <form onSubmit={handleSend}>
      <Paper elevation={3} sx={{ p: 2, m: 2, backgroundColor: '#f9f9f9', position: 'relative' }}>
        <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ pr: 5 }}>
          💬 {sender.appUsername}
        </Typography>

        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button type="submit" variant="contained" onClick={handleSend}>Send</Button>
        </Box>

        {/*list of messages*/}
        <List>
          {messages.map((msg, index) => {
            const isMe = msg.Sender === currentUser.userID;
            return (
              <ListItem
                key={index}
                sx={{
                  flexDirection: isMe ? 'row-reverse' : 'row',
                  textAlign: isMe ? 'right' : 'left',
                }}
              >
                <ListItemAvatar sx={{ minWidth: 'unset', mx: 1 }}>
                  <Avatar sx={{ bgcolor: isMe ? '#1976d2' : '#42a5f5' }}>
                    <ChatBubbleOutlineIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={msg.text}
                  secondary={msg.time}
                  primaryTypographyProps={{
                    sx: isMe ? {  } : {},
                  }}
                  secondaryTypographyProps={{
                    sx: isMe ? { fontSize: '0.8rem' } : { fontSize: '0.8rem' },
                  }}
                />
              </ListItem>
            );
          })}
        </List>

        
      </Paper>
    </form>
  );
};

export default SingleConversation;
