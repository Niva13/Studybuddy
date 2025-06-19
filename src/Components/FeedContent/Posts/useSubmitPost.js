"use client";

import axios from "axios";

const useSubmitPost = ({
  title,
  description,
  details,
  postImg,
  creator,
  creatorName,
  selectedDegree,
  setTitle,
  setDescription,
  setDetails,
  setSelectedFile,
  setPostImg,
  onSuccess, // callback למשל props.onChangeContent
  userID,
}) => {
  const handleSubmit = async () => {
    if (title === "" || description === "" || details === "" || postImg === "") {
      alert("Please fill all the fields");
      return;
    }

    const now = new Date();
    const date =
      now.getDate().toString().padStart(2, "0") +
      "/" +
      (now.getMonth() + 1).toString().padStart(2, "0") +
      "/" +
      now.getFullYear();

    const newPost = {
      title,
      description,
      details,
      date,
      postImg,
      creator,
      creatorName,
      intrest: selectedDegree,
      likes: 0,
    };

    console.log("New Post:", newPost);

    try {
      const res = await axios.post("http://localhost:9090/api/posts", {
        command: "addPostToTotalPosts",
        data: {
          title,
          description,
          details,
          date,
          postImg,
          creator,
          creatorName,
          intrest: selectedDegree,
        },
      });

      const createdPost = res.data.post;

      await axios.post("http://localhost:9090/api/users", {
        command: "addPostToUser",
        data: {
          userID,
          post: createdPost,
        },
      });

      console.log("Post added:");

      setTitle("");
      setDescription("");
      setDetails("");
      setSelectedFile(null);
      setPostImg("");

      if (onSuccess) onSuccess("Home");
    } catch (err) {
      alert("Failed to add post:", err);
    }
  };

  return { handleSubmit };
};

export default useSubmitPost;
