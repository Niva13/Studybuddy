"use client";

import { useState } from "react"
import { getAuth, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from './FireBase'
import { useNavigate } from "react-router-dom"
import './Dashboard.css';

import Typography from '@mui/material/Typography';

const SignIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
   

    const handleSignIn = async (e) => {
        e.preventDefault()
        if (!email || !password) {
            alert("Please fill in both fields.");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/Dashboard');
        }
        catch (err) {
            console.error(err);
            alert("ERROR! user login failed!");
        }
    }

    const ResetPassword = async () => {
        
           
    if (!email) {
            alert("Please enter your email address first.");
            return;
        }

    try {
        await sendPasswordResetEmail(auth, email);
        alert("Email to reset your password was sent!");
        setEmail("");
        setPassword("");
    } catch (error) {
        alert("Failed to send reset email: " + error.message);
        console.error(error);
    }
        
    }

    return (
        <div className="dashboard-container">
            <h2 className="title"> sign in  </h2>
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <input
                    type="email"
                    placeholder="enter your email"
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
                <input
                    type="password"
                    placeholder="enter your password"
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
                
                <Typography style={{ width: '250px', marginTop: '10px' }}>
                    Forgot Password?
                </Typography>
                <div>
                    <button type="button" className="auth-button" onClick={ResetPassword} style={{ width: '140px', marginLeft: '10px' }}>
                        Reset Password
                    </button>
                    
                    <button type="submit" className="auth-button" style={{ width: '100px', marginLeft: '10px' }}>
                        Sign in
                    </button>
                </div>
                
            </form>
        </div>
    )

}
export default SignIn