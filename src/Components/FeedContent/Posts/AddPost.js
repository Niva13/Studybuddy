"use client";
import { useState } from 'react';

import ProfileImageUploader from 'C:/Users/NivaPerez/Desktop/Android 2/studybuddy/src/Components/BuildProfile/ProfileImageUploader';
import UseImageCompression from '../../BuildProfile/useImageCompression';
import useSubmitPost from './useSubmitPost';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { Paper } from '@mui/material';


const AddPost =(props)=> {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [postImg, setPostImg] = useState("");
  const creator = props.data.userID;
  const creatorName = props.data.appUsername;
  const [uid, setUid] = useState("");

  const { compressImage } = UseImageCompression();

  const ImageChangeHandler = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        const compressed = await compressImage(file, 512);
        setPostImg(compressed);
    };
  
  const { handleSubmit } = useSubmitPost({
    title,
    description,
    details,
    postImg,
    creator,
    creatorName,
    selectedDegree: props.data.selectedDegree,
    setTitle,
    setDescription,
    setDetails,
    setSelectedFile,
    setPostImg,
    onSuccess: props.onChangeContent,
    userID: props.data.userID,
  });

  
  return (
    <Paper elevation={3} sx={{ width: '100%', maxWidth: 600, margin: '0 auto', mt: 4 }}>
      <DialogTitle>✍️ Create A New Post</DialogTitle>
      <DialogContent>
        <TextField
          required
          id='Title'
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          inputProps={{ maxLength: 60 }}
        />
        <TextField
          required
          id='Description'
          margin="dense"
          label="Description "
          type="text"
          fullWidth
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          multiline
          maxRows={1}
          inputProps={{ maxLength: 60 }}
        />
        <TextField
          required
          id='Details'
          margin="dense"
          label="Details"
          type="text"
          fullWidth
          multiline
          minRows={7}
          inputProps={{ maxLength: 410 }}
          variant="outlined"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
        <ProfileImageUploader onImageChange={ImageChangeHandler} required />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Publish
        </Button>
      </DialogActions>
    </Paper>
  );
}

export default AddPost;
