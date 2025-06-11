"use client"
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./FireBase";
import React, { useEffect, useState, useRef } from "react";
import { database } from "./FireBase";
import { ref, set, get } from "firebase/database";
import { onValue } from "firebase/database";

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