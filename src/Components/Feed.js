"use client"

import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FireBase";
import { useEffect, useState, useRef } from "react";
import { database } from "./FireBase";
import { ref, get } from "firebase/database";
import MySearchAppBar from "./Bar/MySearchAppBar";
import MyPosts from "./FeedContent/Posts/MyPosts";
import Settings from "./FeedContent/Settings";
import MessagesDashboard from "./FeedContent/Messages/MessagesDashboard";
import AddPost from "./FeedContent/Posts/AddPost";
import ContactSupport from "./FeedContent/Contact Support";
import FetchRestAPI from "./BuildProfile/FetchRestAPI";
import DeleteAccount from "./FeedContent/DeleteAccount";

import { Typography, Box, } from '@mui/material';

import "./Feed.css";
import MainDrawer from "./Drawer/MainDrawer";



const Feed = () => {

    const [user, setUser] = useState(null);
    const [appUsername, setAppUsername] = useState("");
    const [profileImg, setProfileImg] = useState("");
    const [institution, setInstitution] = useState("");
    const [selectedDegree, setSelectedDegree] = useState(""); // selectedDegree
    const [userID, setUserID] = useState("");
    const [intrestsArray, setIntrestsArray] = useState([]);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeContent, setActiveContent] = useState(""); 
    const [feedKey, setFeedKey] = useState(0);
    const [MorI, setMorI] = useState("");

    const categories = [
        "Biology", "Chemistry", "Computer Science", "Design",
        "Economy", "Education", "History", "Law",
        "Mathematics", "Physics", "Political Science", "Psychology"
        ];

    

    const menuRef = useRef(null);



    useEffect(() => {
        if (activeContent === "Home") {
            setFeedKey(prev => prev + 1);
            setActiveContent("");
        }
        if (activeContent === "MyPosts") {
            setMorI("MyPosts");
        }
    }, [activeContent]);


    useEffect(() => {
        const handleClickOutside = (event) => {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
          }
        };
      
        if (isMenuOpen) {
          document.addEventListener("mousedown", handleClickOutside);
        }
      
        return () => {
          document.removeEventListener("mousedown", handleClickOutside);
        };
      }, [isMenuOpen]);
      
      

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
            } else {
                console.log("No user is signed in.");
            }
        });

        return () => unsubscribe();
    }, []);


    useEffect(() => {
        const fetchDataFromFirebase = async () => {
            try {
                
                if (!user) return;

                setUserID(user.uid);

                // reach out to specific path in firebase
                const appUsernameref = ref(database, user.uid + "/Profile/appUsername");
                const profileImgref = ref(database, user.uid + "/Profile/profileImg");
                const institutionref = ref(database, user.uid + "/Profile/selectedInstitution");
                const selectedDegreeref = ref(database, user.uid + "/Profile/selectedDegree");
                const intrestsref = ref(database, user.uid + "/Profile/intrests");


                const snapshotUsername = await get(appUsernameref);
                const snapshotProfileImg = await get(profileImgref); 
                const snapshotInstitution = await get(institutionref);
                const snapshotSelectedDegree = await get(selectedDegreeref); 
                const snapshotIntrests = await get(intrestsref);
                

                if (snapshotUsername.exists()) {

                    setAppUsername(snapshotUsername.val());
                    setProfileImg(snapshotProfileImg.val());
                    setInstitution(snapshotInstitution.val());
                    setSelectedDegree(snapshotSelectedDegree.val());
                    setIntrestsArray(snapshotIntrests.val() || []);
                    

                    console.log("Data fetched successfully:", appUsername, profileImg);
                }

            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };


        fetchDataFromFirebase();
    },[user]);


    

    

    return (
        <div className="feed-container">
            <MainDrawer
                data = {{appUsername, profileImg, institution, intrestsArray, userID, selectedDegree, activeContent}}
                onChangeContent={setActiveContent}
            />
            <MySearchAppBar data = {{appUsername, profileImg, institution, intrestsArray, userID}}
                            onChangeContent={setActiveContent}/>
            <Box key={feedKey}
                sx={{
                display: 'flex',
                justifyContent: 'center',
                minHeight: 'calc(100vh - 64px)',
                marginTop: 0,
                paddingTop: 0,
                width: '100%',
                overflow: 'auto',
                }}>

                {
                    (() => {
                    if (typeof activeContent === "string") {
                        switch (activeContent) {
                            
                            case "My Posts":
                            return (
                                <MyPosts data={{ appUsername, profileImg, institution, intrestsArray, userID, selectedDegree, activeContent }} onChangeContent={setActiveContent} />
                            );

                            case "FetchProfile":        
                            return (
                                <FetchRestAPI/>
                            );
                            
                            case "Messages":
                            return (
                                <MessagesDashboard data={{ appUsername, profileImg, institution, intrestsArray, userID, selectedDegree}} onChangeContent={setActiveContent}/>
                            );

                            case "Delete Account":
                            return (
                                <DeleteAccount data={{userID, }} onChangeContent={setActiveContent}/>
                            );

                            case "Contact Support":
                            return (
                                <ContactSupport/>
                            );


                            case "AddPost":
                            return (
                                <AddPost data={{appUsername, profileImg, institution, intrestsArray, userID, selectedDegree}} onChangeContent={setActiveContent}/>
                            );
                            

                            case "Home":
                                return null;
                                

                            default: {
                                if (categories.includes(activeContent)) {
                                    return (
                                    <MyPosts
                                        data={{ appUsername, profileImg, institution, intrestsArray, userID, selectedDegree, activeContent }}
                                        onChangeContent={setActiveContent}
                                    />
                                    );
                                } else if (activeContent && activeContent !== appUsername) {

                                    return (
                                    <MyPosts
                                        
                                        data={{ appUsername: activeContent }}
                                        onChangeContent={setActiveContent}
                                    />
                                    );
                                } else {
                                    return(
                                    <Typography variant="h5" align="center" padding={2}>
                                        Wellcome to your feed, {appUsername}!
                                    </Typography>
                                    );
                                }
                            }
                        }

                    } // close if typeof activeContent === "string"



                    if (typeof activeContent === "object" && activeContent.type === "UserProfile") {
                        const user = activeContent.user;
                        console.log(user.appUsername, "befor MyPosts");

                        return (
                            <MyPosts
                                data={{
                                    appUsername: user.appUsername,
                                    profileImg: user.profileImg || "",
                                    institution: user.selectedInstitution || "",
                                    intrestsArray: user.intrests || [],
                                    userID: user.userID,
                                    selectedDegree: user.selectedDegree || "",
                                    activeContent: user.selectedDegree,
                                }}
                                onChangeContent={setActiveContent}
                            />
                        );
                    }

                    })()
                }
            </Box>    
        </div>
    );
};
 
export default Feed;

