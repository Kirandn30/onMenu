import { IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { menuType } from 'apps/shop/src/redux/services'
import React, { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { RootState } from 'apps/shop/src/redux/store';

type Props = {
    m: menuType
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setMenuToBeEdited: React.Dispatch<React.SetStateAction<menuType | null>>
}

export default function MenuItemComponent({ m, setEditMode, setMenuToBeEdited }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { selectedMenu } = useSelector((state: RootState) => state.branches)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const menuStyles: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: "10px",
        background: selectedMenu?.id === m.id ? "#0094FF" : "",
        color: selectedMenu?.id === m.id ? "white" : "",
        borderRadius: 10,
    }

    return (
        <div key={m.id} style={menuStyles}>
            <Typography variant='h6'>{m.menuName}</Typography>
            <div>
                <IconButton
                    id={m.id}
                    onClick={handleClick}
                    sx={{color: selectedMenu?.id === m.id ? "white" : "black",}}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id={m.id}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            width: '12ch',
                        },
                    }}
                >
                    <MenuItem>Unpublish</MenuItem>
                    <MenuItem onClick={() => { setEditMode(true); setMenuToBeEdited(m); handleClose() }}>Edit</MenuItem>
                    <MenuItem>Delete</MenuItem>
                </Menu>

            </div>
        </div>
    )
}