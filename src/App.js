"use client"

import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard';
import SignIn from "./Components/SignIn";
import SignUp from "./Components/SignUp";
import BuildYourProfile from "./Components/BuildProfile/BuildYourProfile";
import FetchRestAPI from "./Components/BuildProfile/FetchRestAPI";
import Posts from "./Components/FeedContent/Posts/MyPosts";
import SinglePost from "./Components/FeedContent/Posts/SinglePost";


function App() {
    return (
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard key={Date.now()}/>} />
            <Route path="SignIn" element={<SignIn/>} />
            <Route path="SignUp" element={<SignUp/>} />
            <Route path="Dashboard" element={<Dashboard key={Date.now()}/>} />
            <Route path="BuildYourProfile" element={<BuildYourProfile/>} />
            <Route path="FetchRestAPI" element={<FetchRestAPI/>} />
            <Route path="FetchRestAPI" element={<FetchRestAPI/>} />
            <Route path="Posts" element={<Posts/>} />
            <Route path="SinglePost" element={<SinglePost/>} />
          </Routes>
      </BrowserRouter>
  );
}

export default App;


/*<Route path="/" element={<Dashboard/>} />
<Route path="YourCountries" element={<YourCountries/>} />*/