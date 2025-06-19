"use client";

import { useEffect, useState} from "react";
import useGetPosts from "./useGetPosts";

import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import SinglePost from "./SinglePost";
import { Box } from '@mui/material';


const MyPosts = (props) => {

  const [selectedPost, setSelectedPost] = useState(null);
  
  const appUsername = props.data.appUsername;


  const { posts: itemData, error } = useGetPosts(props.data.userID, props.data.activeContent);


  useEffect(() => {
    setSelectedPost(null);
  }, [props.data.activeContent]);


  const handleClick = (item) => {
    setSelectedPost(item);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', mt: 2 }}>
        <div className="subtitle">{props.data.activeContent}</div>
      </Box>
      {selectedPost && (
        <Box sx={{ marginTop: 4 }}>
          <SinglePost
            selectedPost={selectedPost}
            appUsername={appUsername}
            userID={props.data.userID}
            onClose={() => setSelectedPost(null)}
          />
        </Box>
      )}
      <ImageList sx={{ width: '100%', overflow: 'visible' }} cols={3} rowHeight={170}>
        {Array.isArray(itemData) && itemData.map((item) => (
          <ImageListItem
            key={item.postImg}
            onClick={() => handleClick(item)}
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s ease, box-shadow 0.1s ease',
              '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                zIndex: 1,
              },
            }}
          >
            <img
              src={item.postImg} // Base 64 encoded image
              alt={item.title}
              loading="lazy"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </ImageListItem>
        ))}
      </ImageList>

    </Box>
  );
};

export default MyPosts;



