"use client";

import "./BuildYourProfile.css";
import { useEffect, useState } from "react";
import { database, auth } from "../FireBase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import UsernameInput from "./UsernameInput";
import ProfileImageUploader from "./ProfileImageUploader";
import InstitutionSelector from "./InstitutionSelector";
import DegreeSelector from "./DegreeSelector";
import InterestsCheckboxes from "./InterestsCheckboxes";
import UseImageCompression from "./useImageCompression";
import useSubmitProfile from "./useSubmitProfile";

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


// בתוך הקומפוננטה:
    const { submitHandler } = useSubmitProfile({
        user,
        appUsername,
        profileImg,
        selectedInstitution,
        selectedDegree,
        intrests,
        database,
        auth,
        navigateToDashboard,
        setIsSaved,
        setAppUsername,
        setProfileImg,
        setSelectedFile,
        navigate,
    });


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
