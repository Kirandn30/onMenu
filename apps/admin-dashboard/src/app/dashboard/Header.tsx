import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';
import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { AccountCircle } from '@mui/icons-material';
import { setUser } from '../auth/authSlice';
import img from "../../assets/images/logo.jpeg"

export const Header = () => {

    const dispatch = useDispatch()

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleMenu = (event: any) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Box sx={{ flexGrow: 1, marginBottom: "-25px" }}>
                <AppBar position="static">
                    <Toolbar>
                        <div style={{ flexGrow: 1 }} >
                            {/* <Typography variant="h6" component="div" >
                                On Menu
                            </Typography> */}
                            <img src={img} alt="" />
                            {/* <img src={img2} alt="" /> */}
                        </div>
                        {auth.currentUser && (
                            <div>
                                <IconButton
                                    size="large"
                                    aria-label="account of current user"
                                    aria-controls="menu-appbar"
                                    aria-haspopup="true"
                                    onClick={handleMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={handleClose}>On Menu</MenuItem>
                                    <MenuItem onClick={() => {
                                        signOut(auth)
                                        dispatch(setUser(null))
                                        handleClose()
                                    }}>SignOut</MenuItem>
                                </Menu>
                            </div>
                        )}
                    </Toolbar>
                </AppBar>
                <br />
            </Box>
        </div>
    )
}
