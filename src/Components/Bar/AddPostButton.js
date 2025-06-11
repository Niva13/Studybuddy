import React from 'react';
import IconButton from '@mui/material/IconButton';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

const AddPostButton = ({ onClick }) => (
  <IconButton size="large" color="inherit" onClick={onClick}>
    <AddPhotoAlternateIcon />
  </IconButton>
);

export default AddPostButton;
