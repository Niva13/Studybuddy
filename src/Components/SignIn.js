"use client";

import { useState } from "react"
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from './FireBase'
import { useNavigate } from "react-router-dom"
import './Dashboard.css';

const SignIn = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
   

    const handleSignIn = async (e) => {
        e.preventDefault()
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/Dashboard');

        } catch (err) {
            console.log(err)
            alert("ERROR! user login failed!");
            navigate(0);
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
                <button type="submit" className="auth-button"> Sign in </button>
            </form>
        </div>
    )

}
export default SignIn