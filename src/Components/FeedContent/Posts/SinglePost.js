"use client";

import {useEffect, useState} from 'react';

import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';


import axios from 'axios';


const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transform: expand ? 'rotate(180deg)' : 'rotate(0deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const SinglePost = ({ selectedPost, appUsername , onClose, userID }) => {
  const [expanded, setExpanded] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeOrUnliked, setLikeOrUnliked] = useState(false);
  const [numOfLikes, setNumOfLikes] = useState(0);


  useEffect(() => {
    const isItLiked = async () => {
      try{
        const res = await axios.post("http://localhost:9090/api/users/IsItLiked", {
          userID: userID,
          postID: selectedPost._id,
        });
        setLikeOrUnliked(res.data.isItLike);
      }
      catch(err){
        console.error("Error fetching unread messages count", err);
      }
    }

    if (userID && selectedPost){
      isItLiked();
    }
    
  }, [selectedPost, userID]);



  
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await axios.post("http://localhost:9090/api/messages/getNumLikes", {
          postID: selectedPost._id,
        });
        setNumOfLikes(res.data.likes);
        

      } catch (err) {
        console.error("Error fetching unread count periodically", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedPost._id]);


  useEffect(() => {
    console.log("numOfLikes = ", numOfLikes);
  }, [numOfLikes]);





  const handleLikeClick = () => {


    const addLikedPosts = async () => { 
      try{
        const res = await axios.post("http://localhost:9090/api/users/addToLikedPosts", {
            userID: userID,
            postID: selectedPost._id,
            ownerID: selectedPost.creator
          });
          
        try{
          const res = await axios.post("http://localhost:9090/api/users/IsItLiked", {
            userID: userID,
            postID: selectedPost._id,
          });
          setLikeOrUnliked(res.data.isItLike);
        }
        catch(err){
          console.error("Error fetching unread messages count", err);
        }
      }
      catch(err){
        console.error("Error fetching unread messages count", err);
      }
          
    }

    if (userID && selectedPost._id){
      addLikedPosts();
    }

    setLikeCount(prev => prev + 1);
  };


  if (!selectedPost) return null;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 'auto' }}>
      <CardHeader
        action={
          <>
            <IconButton onClick={onClose} aria-label="close" sx={{ color: red[500] }}>
              <CloseIcon />
            </IconButton>
            {/*<IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>*/}
          </>
        }
        title={selectedPost.title + ' / by ' + selectedPost.creatorName}
        subheader={selectedPost.date}
      />
      <CardMedia
        component="img"
       
        image={selectedPost.postImg}
        alt={selectedPost.title}
        loading="lazy"
        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {selectedPost.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" onClick={handleLikeClick}>
          <FavoriteIcon sx={{ color: likeOrUnliked ? red[500] : 'inherit' }} />
        </IconButton>
        <Typography variant="body2" sx={{ fontSize: '0.76rem', color: 'text.secondary' }}>
          {numOfLikes}
        </Typography>
        {/*<IconButton aria-label="share">
          <ShareIcon />
        </IconButton>*/}
        <ExpandMore
          expand={expanded ? 1 : 0}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography sx={{ marginBottom: 2 }}><b>Details:</b></Typography>
          <Typography sx={{ marginBottom: 2 }}>
            {selectedPost.details}
          </Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default SinglePost;
