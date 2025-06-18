"use client";

import "./BuildYourProfile.css";
import React, { useEffect, useState } from "react";
import { database, auth } from "../FireBase";
import { ref as dbRef, get, child , set } from "firebase/database";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import UsernameInput from "./UsernameInput";
import ProfileImageUploader from "./ProfileImageUploader";
import InstitutionSelector from "./InstitutionSelector";
import DegreeSelector from "./DegreeSelector";
import InterestsCheckboxes from "./InterestsCheckboxes";
import UseImageCompression from "./useImageCompression";
import axios from "axios";

import { Paper } from '@mui/material';

const BuildYourProfile = (props) => {
    const [appUsername, setAppUsername] = useState("");
    const [profileImg, setProfileImg] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [user, setUser] = useState(null);
    const [items, setItems] = useState([]);
    const [selectedInstitution, setSelectedInstitution] = useState(null);
    const [selectedDegree, setSelectedDegree] = useState(null);
    const [intrests, setIntrests] = useState([]);
    const [isSaved, setIsSaved] = useState(false);

    const navigateToDashboard = useNavigate();
    const navigate = useNavigate();

    const degrees = ["Biology", "Chemistry", "Computer Science", "Design", "Economy", "Education", "History", "Law", "Mathematics", "Physics", "Political Science", "Psychology"];
    const interests = ["Biology", "Chemistry", "Computer Science", "Design", "Economy", "Education", "History", "Law", "Mathematics", "Physics", "Political Science", "Psychology"];

    const { compressImage } = UseImageCompression();

    useEffect(() => {
        if (Array.isArray(props.items)) {
            setItems(props.items);
        }
    }, [props.items]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) setUser(currentUser);
        });
        return () => unsubscribe();
    }, []);

    const institutionsOptions = items.map((inst) => ({
        value: inst.name,
        image: inst.image,
        label: inst.name,
    }));

    const appUsernameChangeHandler = (event) => {
        setAppUsername(event.target.value);
    };

    const intrestChangeHandler = (event) => {
        const { value, checked } = event.target;
        if (checked) setIntrests((prev) => [...prev, value]);
        else setIntrests((prev) => prev.filter((intrest) => intrest !== value));
    };

    const ImageChangeHandler = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setSelectedFile(file);
        const compressed = await compressImage(file, 512);
        setProfileImg(compressed);
    };

    const submitHandler = async (event) => {
        event.preventDefault();
        if (!user) return;

        if (appUsername.length <= 10 && appUsername && profileImg && selectedInstitution && intrests.length && selectedDegree) {
            
            try {

                const snapshot = await get(dbRef(database, "/"));
                const allUsers = snapshot.val();

                const isUsernameTaken = Object.values(allUsers || {}).some((u) => {
                    return u.Profile && u.Profile.appUsername === appUsername;
                });

                if (isUsernameTaken) {
                    console.log("Username already taken");
                    return;
                }

                const profileData = {
                    appUsername,
                    profileImg,
                    selectedInstitution: selectedInstitution.value,
                    intrests,
                    selectedDegree: selectedDegree.value,
                };

                await set(dbRef(database, user.uid + "/Profile/"), profileData);
                
                try {
                    const res = await axios.post("http://localhost:9090/api/users", { //findUser
                        command: 'findUser',
                        data: {
                            userID: user.uid,
                        }
                    });
                    try{
                        const res = await axios.post("http://localhost:9090/api/users", { //updateUser
                        command: 'updateUser',
                        data: {
                                userID: user.uid,
                                selectedDegree: selectedDegree.value,
                                email: user.email,
                                appUsername: appUsername,
                                selectedInstitution: selectedInstitution.value,
                                intrests: intrests,
                                profileImg: profileImg,
                            }
                        });
                        console.log("user selectedDegree updated successfully at MondoDB");
                        await signOut(auth);
                    }
                    catch(err){
                        console.log(err);
                    }
                    
                }
                catch (err) {
                    try { const res = await axios.post("http://localhost:9090/api/users", { //if user not found then addUser
                        command: 'addUser',
                        data: {
                                userID: user.uid,
                                selectedDegree: selectedDegree.value,
                                email: user.email,
                                appUsername: appUsername,
                                selectedInstitution: selectedInstitution.value,
                                intrests: intrests,
                                profileImg: profileImg,
                            }
                        });
                        console.log("user registered successfully at MondoDB");

                        setIsSaved(true);
                        setAppUsername("");
                        setProfileImg("");
                        setSelectedFile(null);
                        setTimeout(() => setIsSaved(false), 3000);
                        console.log("Profile saved successfully!");
                        await signOut(auth);
                        navigateToDashboard("/Dashboard");
                    }

                    catch (err) {
                        console.log(err);
                        console.log(err);
                        navigate(0);
                    }
                }
                

                
            } catch (error) {
                console.error("Error saving profile:", error);
            }
        } else {
            console.log("Please fill in all the required fields.");
        }
    };

    return (
        <Paper className="build-profile-wrapper" >
            <div className="build-profile-wrapper">
                <form onSubmit={submitHandler}>
                    <div className="new-expense__controls">
                        <UsernameInput value={appUsername} onChange={appUsernameChangeHandler} />
                        <ProfileImageUploader onImageChange={ImageChangeHandler} />
                        <InterestsCheckboxes interests={interests} selectedInterests={intrests} onChange={intrestChangeHandler} />
                        <InstitutionSelector institutions={institutionsOptions} selectedInstitution={selectedInstitution} onChange={setSelectedInstitution} />
                        <DegreeSelector degrees={degrees} selectedDegree={selectedDegree} onChange={setSelectedDegree} />
                    </div>

                    <div className="new-expense__actions">
                        <button type="submit">Save Changes</button>
                    </div>
                </form>

                {profileImg && (
                    <div className="profile-preview">
                        <h3>Preview of your profile:</h3>
                        <img src={profileImg} alt="Profile" className="preview-img" />
                    </div>
                )}
            </div>
        </Paper>
    );
};

export default BuildYourProfile;
