"use client";

import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';

const NotificationsButton = () => (
  <IconButton size="large" aria-label="show notifications" color="inherit">
    <Badge badgeContent={10} color="error">
      <NotificationsIcon />
    </Badge>
  </IconButton>
);

export default NotificationsButton;
