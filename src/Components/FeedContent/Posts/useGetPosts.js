import { useEffect, useState } from "react";
import axios from "axios";

const useGetPosts = (userID, activeContent) => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);


  useEffect(() => {
    setPosts([]);               
    const FetchMyPosts = async () => {
    try {
        if (userID && activeContent === 'MyPosts') {
          const response = await axios.post("http://localhost:9090/api/users", {
          command: 'selectPostsByUserID',
          data: { userID },
          });
          const { posts } = response.data;
          setPosts(posts);
        }
        else {
          const response = await axios.post("http://localhost:9090/api/posts", {
          command: 'selectPostsByIntrest',
          data: { userID, activeContent },
          });
          const { posts } = response.data;
          setPosts(Array.isArray(posts) ? posts : []);
        }
    } 
    catch (err) {
        setError(err.message);
      }
    };

    if (userID) {
    FetchMyPosts();
    }

  }, [userID, activeContent]);

  return { posts, error };
};

export default useGetPosts;
