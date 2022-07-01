import { auth } from 'apps/shop/src/config/firebase'
import { signOut } from 'firebase/auth'
import React, { useState } from 'react'
import { MoreVert, Person, PersonOutlineOutlined } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { RootState } from 'apps/shop/src/redux/store';
import { app } from "../config/firebase"
import { useEmailPassword } from '../hooks/emailPassword';

export const Header = () => {

    const { User } = useSelector((state: RootState) => state.auth)
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { logOut } = useEmailPassword({ app })

    return (
        <div className='header'>
            <PersonOutlineOutlined fontSize='large' />
            <Typography variant='h6'>{User?.email}</Typography>
            {User && <>
                <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                    <MoreVert />
                </IconButton>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                >
                    <MenuItem>My account</MenuItem>
                    <MenuItem onClick={() => logOut()}>Logout</MenuItem>
                </Menu>
            </>}
        </div>
    )
}