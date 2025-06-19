"use client";

import { useEffect, useState, useRef } from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';

import useFetchAllUsers from './useFetchAllUsers';


const SearchWrapper = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
}));

const SearchBar = ({ appUsername, userID, onSelectUser }) => {

  const [searchText, setSearchText] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const inputRef = useRef();

  const allUsers = useFetchAllUsers(userID);


  


  useEffect(() => {
    const trimmed = searchText.trim();
    if (!trimmed) {
      setFilteredUsers([]);
      setOpenMenu(false);
    } else {
      const matches = allUsers.filter((user) =>
        user.appUsername &&
        user.appUsername.toLowerCase().startsWith(trimmed.toLowerCase()) &&
        user.appUsername !== appUsername
      );
      setFilteredUsers(matches);
      setOpenMenu(matches.length > 0);
    }
  }, [searchText, allUsers, appUsername]);

  

  const handleSelect = (user) => {

    setSearchText('');
    setOpenMenu(false);

    if (onSelectUser) {
      onSelectUser(user)
    }
    
  };

  return (
    
    <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
      <div style={{ position: 'relative' }}>
        <SearchWrapper>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            inputRef={inputRef}
            placeholder="Search…"
            inputProps={{ 'aria-label': 'search' }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onFocus={() => {
              if (filteredUsers.length > 0) setOpenMenu(true);
            }}
          />
        </SearchWrapper>

        {openMenu && (
          <Paper
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 10,
            }}
          >
            <MenuList>
              {filteredUsers.map((user, index) => (
                <MenuItem key={index} onClick={() => handleSelect(user)}>
                  {user.appUsername}
                </MenuItem>
              ))}
            </MenuList>
          </Paper>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default SearchBar;
