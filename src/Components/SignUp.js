"use client";

import { useState } from "react";
import { onAuthStateChanged, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from './FireBase';
import { useNavigate } from "react-router-dom";
import axios from 'axios';



const SignUp = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRePassword] = useState("");
    const [message, setMessage] = useState("");
    const [userID, setUserID] = useState("");
    const [user, setUser] = useState(null);

    const navigateToFetchRestAPI = useNavigate();
    const navigate = useNavigate();
    

    const SignUp = async (e) => {

        e.preventDefault()
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            const uid = userCredential.user.uid;
            setUser(userCredential.user);
            setUserID(uid);
            alert("user registered successfully at firebase");
            navigateToFetchRestAPI('/FetchRestAPI');
          
        } catch (err) {
            console.log(err);
            alert(err);
            navigate(0);
        }
    }



    const handleSignUp = async (e) => {
        e.preventDefault()
        if (password === repassword) {
            await SignUp(e)
        }
        else {
            alert("passwords do not match!");
            navigate(0);
        }
    }

    
    return (
        <div className="dashboard-container">
            <h2 className="title"> sign Up </h2>
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="new-expense__control">
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                        style={{
                            padding: '10px',
                            margin: '10px 0',
                            width: '250px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div className="new-expense__control">
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} 
                        style={{
                            padding: '10px',
                            margin: '10px 0',
                            width: '250px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <div className="new-expense__control">
                    <input
                        type="password"
                        placeholder="Repeat your password"
                        value={repassword}
                        onChange={(e) => setRePassword(e.target.value)} 
                        style={{
                            padding: '10px',
                            margin: '10px 0',
                            width: '250px',
                            borderRadius: '8px',
                            border: '1px solid #ccc',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <button type="submit" onClick={() => handleSignUp} className="auth-button"> Sign Up </button>
            </form>
        </div>
    );
}
export default SignUp
