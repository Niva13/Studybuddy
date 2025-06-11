// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb+srv://studybuddyproject:shgMU9qov7ZKk0iV@studybuddy.qndgkew.mongodb.net/Users', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


const userSchema = new mongoose.Schema({
    userID: String,
    selectedDegree: String,
    email: String,
    appUsername: String,
    selectedInstitution: String,
    profileImg: String,
    unreadMessages: Number,
    likedPosts: [String],
    intrests: [String],
    posts: [{ title: String, description: String, details: String, date: String, postImg: String, creator: String, creatorName: String, likes: Number, intrest: String }],
});

const postSchema = new mongoose.Schema({
    title: String,
    description: String,
    details: String,
    date: String,
    postImg: String,
    creator: String,
    creatorName: String,
    likes: Number,
    intrest: String
});


const messageSchema = new mongoose.Schema({
    Sender: String,
    receiver: String,
    text: String,
    time: String,
    isReadBySender: { type: Boolean, default: false },
    isReadByReceiver: { type: Boolean, default: false }

});

const User = mongoose.model('User', userSchema);
const Post = mongoose.model('Post', postSchema);
const Message = mongoose.model('Message', messageSchema);

//module.exports = mongoose.model('Message', messageSchema);




/*mongoose.connect('mongodb://localhost:27017/chatDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});*/



app.post('/api/users', async (req, res) => {
    const { command, data } = req.body;

    try {
        const { command, data } = req.body;
        const { userID, selectedDegree, post } = data;
        
        switch (command) {
            case 'addUser':
                {const newUser = new User({ 
                    userID: data.userID, 
                    selectedDegree: data.selectedDegree,
                    email: data.email,
                    appUsername: data.appUsername,
                    selectedInstitution: data.selectedInstitution,
                    profileImg: data.profileImg,
                    intrests: data.intrests,
                    unreadMessages: 0,
                    likedPosts: [],});
                await newUser.save();
                return res.json({ message: 'User inserted successfully', user: newUser });
            }

            case 'findUser':{
                const user = await User.findOne({ userID });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.json({ message: 'User found', user });
            }


            case 'updateUser':{
                const { userID, selectedDegree, email, appUsername, selectedInstitution, profileImg, intrests } = data;
                const user = await User.findOne({ userID });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                user.userID = data.userID;
                user.selectedDegree = data.selectedDegree;
                user.email = data.email;
                user.appUsername = data.appUsername;
                user.selectedInstitution = data.selectedInstitution;
                user.profileImg = data.profileImg;
                user.intrests = data.intrests;

                await user.save();
                return res.json({ message: 'User updated', user });
            }

            case 'getAllUsers':
                {
                    const users = await User.find();
                    if (!users || users.length === 0) {
                        return res.status(404).json({ message: 'No users found' });
                    }
                    
                    return res.json({ message: 'Users fetched', users });
                    
                }
            
                
            case 'addPostToUser':
                {
                    const { userID, post } = data;

                    const user = await User.findOne({ userID });
                    if (!user) {
                        return res.status(404).json({ message: 'User not found' });
                    }

                    user.posts.push(post);
                    await user.save();

                    return res.json({ message: 'Post added successfully', user });
                  }

            
            case 'selectPostsByUserID':
              {
                const user = await User.findOne({ userID });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }
                return res.json({ message: 'Users fetched posts', posts: user.posts });
              }

            /*case 'updateUnreadMessages':
              {
                const { userID, Function } = data;

                console.log("Function = ", Function);
                console.log("userID = ", userID);


                const user = await User.findOne({ userID });
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                console.log("user.unreadMessages = ", user.unreadMessages);
                
                if (Function === 'increase') {
                    user.unreadMessages = user.unreadMessages + 1;
                } else if (Function === 'decrease') {
                    user.unreadMessages = user.unreadMessages - 1;
                }

                await user.save();
                return res.json({ message: 'User unread messages updated', user });
            }*/

            

            default:
                return res.status(400).json({ message: 'Unknown command' });

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});


app.post('/api/users/addToLikedPosts', async (req, res) => {

    const { userID, postID,ownerID } = req.body;

    try {
        const postFromPost = await Post.findById(postID);
        const user = await User.findOne({ userID });

        if (!postFromPost || !user) {
            return res.status(404).json({ message: 'Post not found' });
        }
        
        const isLiked = user.likedPosts.includes(postID);

        await User.updateOne(
            { userID: ownerID, "posts._id": postID },
            { $inc: { "posts.$.likes": isLiked ? -1 : 1 } }
          );


        if (isLiked) {
          user.likedPosts = user.likedPosts.filter((id) => id !== postID);
          await Post.updateOne({ _id: postID }, { $inc: { likes: -1 } });

        }
        else{

          user.likedPosts.push(postFromPost._id);
          await Post.updateOne({ _id: postID }, { $inc: { likes: 1 } });
          
        }

        await user.save();
        
        return res.json({ message: 'Post liked', postFromPost });

    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});




app.post('/api/users/IsItLiked', async (req, res) => {

    const { userID, postID } = req.body;

    try {

      const user = await User.findOne({ userID });

      const isItInLiked = user.likedPosts.includes(postID);

      let isItLike;

      if(isItInLiked){
        isItLike = true;
        console.log("2. isItInLike = ",isItInLiked);
      }
      else{
        isItLike = false;
        console.log("3. isItInLike = ",isItInLiked);
      }
      return res.json({ message: 'checking if is liked completed',isItLike: isItLike});
    } 
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});






























app.post('/api/posts', async (req, res) => {
    const { command, data } = req.body;

    try {
        const { command, data } = req.body;
        const { userID, selectedDegree, post } = data;
        
        switch (command) {
            
            
            case 'addPostToTotalPosts':
                {const newPost = new Post({ 
                    title: data.title,
                    description: data.description,
                    details: data.details,
                    date: data.date, 
                    postImg: data.postImg,
                    creator: data.creator,
                    creatorName: data.creatorName,
                    likes:0,
                    intrest: data.intrest});
                    
                await newPost.save();
                return res.json({ message: 'User inserted successfully', post: newPost });
            }
                
            
            case "selectPostsByIntrest":{
                const posts = await Post.find({ intrest: data.activeContent });
                    if (!posts || posts.length === 0) {
                        return res.status(404).json({ message: 'Intrest not found' });
                    }
                    const allPosts = posts;
                    return res.json({ message: 'Users fetched posts', posts: allPosts });
            }

            default:
                return res.status(400).json({ message: 'Unknown command' });

        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});






























app.post('/api/messages/unreadMessages', async (req, res) => {

  const { receiverID } = req.body;

  //console.log("receiverID = ", receiverID);

  try {
    const user = await User.findOne({ userID: receiverID });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, unreadMessages: user.unreadMessages || 0 });
  }
  catch (err) {
    console.error("Error fetching unread messages count", err);
    res.status(500).json({ success: false, error: err.message });
  }
});



app.post('/api/messages/send', async (req, res) => {

    const { Sender, receiver, text, time } = req.body;

    if (!Sender || !receiver || !text) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    /*console.log("sender from server:" + Sender);
    console.log("receiver from server:" + receiver);
    console.log("text from server:" + text);

    console.log(">>> Saving message:", { Sender, receiver, text, time });*/



    const newMessage = new Message({ 
        Sender,
        receiver, 
        text, 
        time,
        isReadByReceiver: false,
        isReadBySender: true
     });
  
    try {
        await newMessage.save();
        await User.updateOne({ userID: receiver }, { $inc: { unreadMessages: 1 } });
      
        res.json({ success: true, message: newMessage });
    } 
    catch (err) {
        console.error("error in sending message", err);
        res.status(500).json({ success: false, error: err.message });
    }
});







app.get('/api/messages/last/:userID', async (req, res) => {

  //console.log("looking for messages for", req.params);

  const { userID } = req.params;

  try{
  
    const messages = await Message.find({
      $or: [{ Sender: userID }, { receiver: userID }]
    }).sort({'_id':-1});

    //console.log("found messages:", messages);


    //console.log("Fetched messages:", messages);


    const latestMap = new Map();

    messages.forEach((msg) => {
      const otherUser = msg.Sender === userID ? msg.receiver : msg.Sender;
      if (!latestMap.has(otherUser)) {
        latestMap.set(otherUser, msg);
      }
    });

    //console.log("latestMap: from last/:userID:", latestMap);

    res.json({ success: true, latestMessages: Array.from(latestMap.values()) });
  } 
  catch (err) {
    console.log("error in get last messages", err);
    res.status(500).json({ success: false, error: err.message });
  }
});








app.get('/api/messages/:user1/:user2', async (req, res) => {
  const { user1, user2 } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { Sender: user1, receiver: user2 },
        { Sender: user2, receiver: user1 }
      ]
    }).sort({'_id':-1});

    res.json({ success: true, messages });
  } 
  catch (error) {
    console.error("error in getting messages", error);
    res.status(500).json({ success: false, error: error.message });
  }
});



// server/index.js
app.post('/api/messages/markAsRead', async (req, res) => {
  const { senderID, receiverID } = req.body;

  try {
    if (!senderID || !receiverID) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    const result = await Message.updateMany(
      { Sender: senderID, receiver: receiverID, isReadByReceiver: false},
      { $set: { isReadByReceiver: true } }
    );

    const unreadCount = result.modifiedCount;

    await User.updateOne(
      { userID: receiverID, unreadMessages: { $gte: unreadCount }},
      { $inc: { unreadMessages: -unreadCount } }
    );

    io.to(senderID).emit("messagesReadNotification", { from: receiverID });
    res.json({ success: true, updatedCount: result.modifiedCount });
  } 
  catch (err) {
    console.error("error marking messages as read", err);
    res.status(500).json({ success: false, error: err.message });
  }
});








// Socket.IO
io.on('connection', (socket) => {
  console.log('user connected');

  socket.on('join', (userId) => {
    socket.join(userId);
  });

  socket.on('sendMessage', (message) => {

    io.to(message.receiver).emit('receiveMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  /*socket.on("messagesRead", ({ sender, receiver }) => {
    io.to(sender).emit("messagesReadNotification", { from: receiver });
  });*/



});






server.listen(9090, () => {
  console.log('Server is running on port 9090');
});


