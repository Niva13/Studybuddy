"use client";

import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography } from '@mui/material';

const MessageListItem = ({ sender, text, time, onClick, unread }) => {
  return (
    <ListItem button onClick={onClick} alignItems="flex-start">
      <ListItemAvatar>
        <Avatar>{sender[0]}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: unread ? 'bold' : 'normal' }}
          >
            {sender}
          </Typography>
        }
        secondary={
          <>
            <Typography
              component="span"
              variant="body2"
              color="text.primary"
              sx={{ fontWeight: unread ? 'bold' : 'normal' }}
            >
              {text}
            </Typography>
            {" — " + time}
          </>
        }
      />
    </ListItem>
  );
};

export default MessageListItem;
