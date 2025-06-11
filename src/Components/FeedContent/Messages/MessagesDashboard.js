import React, { useState, useEffect } from 'react';
import { Paper, Typography, List, Divider, Box } from '@mui/material';
import MessageListItem from './MessageListItem';

import axios from 'axios';
import {Button, ListItem, ListItemText, ListItemAvatar, Avatar} from '@mui/material';

import SingleConversation from './SingleConversation';
import { set } from 'mongoose';
import { io } from 'socket.io-client';
import { useRef } from 'react';


const MessagesDashboard = (props) => {
  const [selectedSender, setSelectedSender] = useState(null);
  const [selectedSenderUID, setSelectedSenderUID] = useState(null);
  
  const [showNewChatMenu, setShowNewChatMenu] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [lastMessages, setLastMessages] = useState([]);

  const [refreshFlag, setRefreshFlag] = useState(false);
  const [refreshFlagSokcket, setRefreshFlagSokcket] = useState(false);
  const [refreshFlagRead, setRefreshFlagRead] = useState(false);
  const socket = useRef(null);

  
  const getUsernameByID = (userID) => {
    const user = allUsers.find(u => u.userID === userID);
    return user ? user.appUsername : '';
  };




  

  useEffect(() => {
    socket.current = io("http://localhost:9090");

    socket.current.emit("join", props.data.userID);

    socket.current.on("receiveMessage", (msg) => {
      const otherUser = msg.Sender === props.data.userID ? msg.receiver : msg.Sender;


      setLastMessages((prevMessages) => {
        const filtered = prevMessages.filter(m =>
          (m.Sender !== otherUser && m.receiver !== otherUser)
        );

        return [msg, ...filtered];
      });

      setRefreshFlagSokcket(prev => !prev);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [props.data.userID]);


  



  useEffect(() => {
    const fetchLastMessages = async () => {
      try {
        const res = await axios.get(`http://localhost:9090/api/messages/last/${props.data.userID}`);
        setLastMessages(res.data.latestMessages || []);
      } 
      catch (err) {
        console.error("Error fetching last messages", err);
        alert("Error fetching last messages");
      }
    };

    if(props.data.userID)
    {
      fetchLastMessages();
    }
  }, [props.data.userID, refreshFlag, refreshFlagSokcket, refreshFlagRead]);








  useEffect(() => {

  const fetchUsers = async () => {
    try {
      const res = await axios.post("http://localhost:9090/api/users", {
        command: 'getAllUsers',
        data: {userID: props.data.userID},
      });


      const otherUsers  = res.data.users.filter(u => u.appUsername !== props.data.appUsername);
      setAllUsers(otherUsers);

      setFilteredUsers(otherUsers);

      const usersInConversation = new Set(
        lastMessages.map(msg =>
          msg.Sender === props.data.userID ? msg.receiver : msg.Sender
        )
      );

      const filtered = otherUsers.filter(
        u => !usersInConversation.has(u.userID)
      );

      setFilteredUsers(filtered);

    } catch (err) {
      console.error("Error fetching users", err);
    }
  };
  fetchUsers();
}, [lastMessages, refreshFlag, refreshFlagSokcket, refreshFlagRead, props.data.appUsername, props.data.userID]);



  /*const messages = [
    
  ];

  const handleMessageClick = (sender) => {
    setSelectedSender(sender);
  };*/

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        mt: 4,
        gap: 2,
        px: 2,
      }}
    >

      <Paper elevation={3} sx={{ width: 600, maxHeight: 600, overflowY: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            📬 Messages
          </Typography>
          <Button variant="outlined" size="small" onClick={() => setShowNewChatMenu(!showNewChatMenu)}>
            New Chat
          </Button>

          

        </Box>

        {showNewChatMenu && (
          <List sx={{ maxHeight: 200, overflowY: 'auto' }}>
            {filteredUsers.map((user, idx) => (
              <ListItem button key={idx} onClick={() => {
                setSelectedSender(user.appUsername);
                setSelectedSenderUID(user.userID);
                setShowNewChatMenu(false);
              }}>
                <ListItemAvatar>
                  <Avatar>{user.appUsername[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={user.appUsername} />
              </ListItem>
            ))}
          </List>
        )}

        <Box sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
              Conversations
          </Typography>
        </Box>

        <List>
          {lastMessages.map((msg, idx) => {
            const otherUserID = msg.Sender === props.data.userID ? msg.receiver : msg.Sender;
            const otherUsername = getUsernameByID(otherUserID);

            return (
              <MessageListItem
                key={idx}
                sender={otherUsername}
                text={msg.text || "No message content"}
                time={msg.time}
                unread={msg.Sender === otherUserID && msg.isReadByReceiver === false}
                onClick={() => {
                  setSelectedSender(otherUsername);
                  setSelectedSenderUID(otherUserID);
                  setShowNewChatMenu(false);
                }}
              />
            );
          })}
        </List>


      </Paper>

      {/* Conversation Panel */}
      {selectedSender && (
        <Box sx={{ flex: 1, width: 600, maxHeight: 600, overflowY: 'auto' }}>
          <SingleConversation 
            sender={{userID: selectedSenderUID, appUsername: selectedSender}} 
            currentUser={{ userID: props.data.userID, appUsername: props.data.appUsername }}
            onClose={() => setSelectedSender(null)}
            onMessageSent={() => setRefreshFlag(prev => !prev)}
            onRefreshSokcket={() => setRefreshFlagSokcket(prev => !prev)}
            
          />
        </Box>
      )}
    </Box>
  );
};

export default MessagesDashboard;
