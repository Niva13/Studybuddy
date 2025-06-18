"use client"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./FireBase";

const LogOut = (props) => {

    const handleSignOut = async () => {
        await signOut(auth)
        alert("user signed out! ")
    }
    
    return (
        <div>
           
        </div>
    )
}