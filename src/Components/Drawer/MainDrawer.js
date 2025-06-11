"use client";
import {useState} from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';


import HamburgerButton from './HamburgerButton';
import Feed from '../Feed.css';

import SettingIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';
import MessageIcon from '@mui/icons-material/Message';
import PhotoFilterIcon from '@mui/icons-material/PhotoFilter';
import LogoutIcon from '@mui/icons-material/Logout';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import Collapse from '@mui/material/Collapse';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HomeIcon from '@mui/icons-material/Home';
import FaceRetouchingNaturalIcon from '@mui/icons-material/FaceRetouchingNatural';


import { signOut } from "firebase/auth";
import { auth } from "../FireBase"; 
import { useNavigate } from "react-router-dom";


const MainDrawer = (props) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [intrestsOpen, setIntrests] = useState(false);

  const navigate = useNavigate();
   

  const toggleDrawer = (newOpen) => () => {
    setDrawerOpen(newOpen);
  };

  
  const handleClick = () => {
    setIntrests(!intrestsOpen);
  };

 

  


  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" /*onKeyDown={toggleDrawer(false)}*/>
      
      <ListItemButton onClick={() => {
        props.onChangeContent(props.data.appUsername);
        setDrawerOpen(false);
        }}>
        <ListItemIcon>
          <img className='profile-img' src={props.data.profileImg} />
        </ListItemIcon>
        <ListItemText primary={props.data.appUsername} />
      </ListItemButton>
      
      <ListItemButton onClick={() => {props.onChangeContent(props.data.selectedDegree); setDrawerOpen(false);}}>
        <ListItemIcon>
          <FaceRetouchingNaturalIcon />
        </ListItemIcon>
        <ListItemText 
          primary={props.data.selectedDegree}
          secondary={props.data.institution}/>
      </ListItemButton>

      <ListItemButton onClick={() => {props.onChangeContent("Home"); setDrawerOpen(false);}}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItemButton>

      <ListItemButton onClick={() => {
        props.onChangeContent("Settings");
        setDrawerOpen(false);
        }}>
        <ListItemIcon>
          <SettingIcon />
        </ListItemIcon>
        <ListItemText primary="Settings" />
      </ListItemButton>

      <ListItemButton  onClick={() => {
        props.onChangeContent("MyPosts");
        setDrawerOpen(false);
      }}>
        <ListItemIcon>
          <PhotoFilterIcon />
        </ListItemIcon>
        <ListItemText primary="My Posts" />
      </ListItemButton>

      <ListItemButton onClick={() => {
        props.onChangeContent("Messages");
        setDrawerOpen(false);
        }}>
        <ListItemIcon>
          <MessageIcon />
        </ListItemIcon>
        <ListItemText primary="Messages" />
      </ListItemButton>

      <ListItemButton onClick={handleClick}>
        <ListItemIcon>
          <MenuBookIcon />
        </ListItemIcon>
        <ListItemText primary="My Intrests" />
        {intrestsOpen ? <ExpandLess /> : <ExpandMore />}
         </ListItemButton>
          <List>
            <Collapse in={intrestsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {props.data.intrestsArray?.map((interest, index) => (
                  <ListItemButton 
                    key={index} sx={{ pl: 4 }} 
                    onClick={() => {props.onChangeContent(interest);setDrawerOpen(false);}}>
                  <ListItemText primary={interest} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </List>
          
     

      <Divider />

      <ListItemButton onClick={async() => {await signOut(auth);  navigate('/Dashboard');}}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>

      <ListItemButton onClick={() => {
        props.onChangeContent("Delete Account");
        setDrawerOpen(false);
        }}>
        <ListItemIcon>
          <DeleteIcon />
        </ListItemIcon>
        <ListItemText primary="Delete Account" />
      </ListItemButton>

      <ListItemButton onClick={() => {
        props.onChangeContent("Contact Support");
        setDrawerOpen(false);
        }}>
        <ListItemIcon>
          <ContactSupportIcon />
        </ListItemIcon>
        <ListItemText primary="Contact Support" />
      </ListItemButton>

    </Box>
  );

  return (
    <div>
      <HamburgerButton toggle={toggleDrawer(true)} isOpen={drawerOpen} />

      <Drawer open={drawerOpen} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}

export default MainDrawer;