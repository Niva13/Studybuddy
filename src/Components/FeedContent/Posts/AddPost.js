import * as React from 'react';
import { useState } from 'react';

import ProfileImageUploader from 'C:/Users/NivaPerez/Desktop/Android 2/studybuddy/src/Components/BuildProfile/ProfileImageUploader';
import UseImageCompression from '../../BuildProfile/useImageCompression';
import axios from 'axios';

import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Slide from '@mui/material/Slide';
import { Paper } from '@mui/material';


// אנימציית פתיחה (אופציונלית)
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const AddPost =(props)=> {
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [details, setDetails] = React.useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [postImg, setpostImg] = useState("");
  const creator = props.data.userID;
  const creatorName = props.data.appUsername;
  const [uid, setUid] = useState("");

  const { compressImage } = UseImageCompression();

  const ImageChangeHandler = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        const compressed = await compressImage(file, 512);
        setpostImg(compressed);
    };
  
  const handleSubmit = async() => {

    if(title === "" || description === "" || details === "" || postImg === "") {
      alert("Please fill all the fields");
      return;
    }

    const now = new Date();
    const date =
      now.getDate().toString().padStart(2, '0') + '/' +
      (now.getMonth() + 1).toString().padStart(2, '0') + '/' +
      now.getFullYear();


    const newPost = {
      title,
      description,
      details,
      date,
      postImg,
      creator,
      creatorName,
      intrest: props.data.selectedDegree,
      likes: 0,
    };

    console.log('New Post:', newPost);

    try {

        const res = await axios.post("http://localhost:9090/api/posts", {
          command: 'addPostToTotalPosts',
          data: {
            title: title,
            description: description,
            details: details,
            date: date, 
            postImg: postImg,
            creator: creator,
            creatorName: creatorName,

            intrest: props.data.selectedDegree
          }
        });

        const createdPost = res.data.post;


        const res1 = await axios.post("http://localhost:9090/api/users", {
          command: 'addPostToUser',
          data: {
            userID: props.data.userID,
            post: createdPost
          }
        });

        




        console.log("Post added:");

        setTitle('');
        setDescription('');
        setDetails('');
        setSelectedFile(null);
        setpostImg("");

        props.onChangeContent("Home");



    } 
    catch (err) {
      alert("Failed to add post:", err);
    }

  };

  
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
