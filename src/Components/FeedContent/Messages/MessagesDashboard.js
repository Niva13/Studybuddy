"use client";

import { useState } from 'react';
import { Paper, Typography, List, Box } from '@mui/material';
import MessageListItem from './MessageListItem';

import {Button, ListItem, ListItemText, ListItemAvatar, Avatar} from '@mui/material';

import SingleConversation from './SingleConversation';
import useSocketMessages from './useSocketMessages';
import useFetchLastMessages from './useFetchLastMessages';
import useFetchUsers from './useFetchUsers';
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


  useSocketMessages({
    userID: props.data.userID,
    setLastMessages,
    setRefreshFlagSokcket,
    socket,
  });

  useFetchLastMessages({
    userID: props.data.userID,
    refreshDeps: [refreshFlag, refreshFlagSokcket, refreshFlagRead],
    setLastMessages,
  });

  useFetchUsers({
    userID: props.data.userID,
    appUsername: props.data.appUsername,
    lastMessages,
    refreshDeps: [refreshFlag, refreshFlagSokcket, refreshFlagRead],
    setAllUsers,
    setFilteredUsers,
  });


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
