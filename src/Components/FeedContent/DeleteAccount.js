"use client";

import styled from 'styled-components';

import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';

import { useState } from 'react';

import { getAuth, deleteUser } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import axios from 'axios';



const StyledNOButton = styled.button`
  margin: 10px;
  padding: 10px;
  font-size: 1rem;
  background-color: #4bc259;
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 140px;
  margin-left: 10px;

  &:hover {
    background-color: #3da24c;
  }
`;




const StyledYESButton = styled.button`
  margin: 10px;
  padding: 10px;
  font-size: 1rem;
  background-color: #e42b2b;
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 140px;
  margin-left: 10px;

  &:hover {
    background-color: #b41d1d;
  }
`;





const DeletteAccount = (props) => {

    const [isHoveringNo, setIsHoveringNo] = useState(false);

    const IconComponent = isHoveringNo ? SentimentSatisfiedAltIcon : SentimentVeryDissatisfiedIcon;



   

    const handleDeleteAccount = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
            console.log("No user is currently logged in.");
            return;
        }

        try {
            const db = getDatabase();
            const userRef = ref(db, user.uid);
            await remove(userRef);
            console.log("Realtime database data deleted successfully");
            await deleteUser(user);
            alert("User account deleted successfully");

            const res = await axios.post("http://localhost:9090/api/users/deleteUser", {
                userID: user.uid
                
            });

        } 
        catch (error) {
            console.error("Error deleting user or data:", error);
            alert(error.message);
        }
    };












    const handleNOTDeleteAccount = () => {
        
    }




    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <IconComponent
                    style={{
                        fontSize: '3rem',
                        marginRight: '10px',
                        color: isHoveringNo ? '#3da24c' : '#e42b2b',
                        transition: 'color 0.3s ease'
                    }} 
                />
                <h1>Are you sure you want to DELETE your account?</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <StyledYESButton onClick={handleDeleteAccount}>
                    YES
                </StyledYESButton>
                
                <StyledNOButton
                    onClick={handleNOTDeleteAccount}
                    onMouseEnter={() => setIsHoveringNo(true)}
                    onMouseLeave={() => setIsHoveringNo(false)}
                >
                    NO
                </StyledNOButton>
            </div>
        </div>

    );
}

export default DeletteAccount