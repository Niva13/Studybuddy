"use client"

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./FireBase";
import { useNavigate } from "react-router-dom";
import Feed from "./Feed";
import "./Dashboard.css"


const Dashboard = () => {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser)
        });
        return () => unsub()
    }, [])

    
    return (
        <div>
            {user ? (
                <div>
                    <Feed />
                </div>
            ) : (
                <div className="dashboard-container">
                    <div className="centered-row">
                        <h1 className="title">STUDYBUDDY</h1>
                    </div>
                    <div className="centered-row">
                        <h1 className="subtitle">Sign in or Sign Up</h1>
                    </div>
                    <div className="centered-row">
                        <button className="auth-button" onClick={() => navigate('/SignIn')}>SignIn</button>
                    </div>
                    <div className="centered-row">
                        <h2 className="small-title">Don't have an account?</h2>
                    </div>
                    <div className="centered-row">
                        <button className="auth-button" onClick={() => navigate('/SignUp')}>Sign Up</button>
                    </div>
                </div>
            )}
        </div>

    )

}
export default Dashboard