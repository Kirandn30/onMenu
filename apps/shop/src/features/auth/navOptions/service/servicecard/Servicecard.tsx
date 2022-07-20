import { Button, Card, CardActions, CardContent, CardMedia, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { serviceType } from 'apps/shop/src/redux/services'
import React, { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useSelector } from 'react-redux';
import { RootState } from 'apps/shop/src/redux/store';

type Props = {
    s: serviceType
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setServiceToBeEdited: React.Dispatch<React.SetStateAction<serviceType | null>>
}

export default function ServiceCard({ s, setEditMode, setServiceToBeEdited }: Props) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const { selectedService } = useSelector((state: RootState) => state.branches)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    return (
        <div key={s.id} >
            <div style={{
                background: "#F6F7FA", padding: 15, borderRadius: 10, display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gridTemplateRows: "1fr 3fr",
                gap: "2px 2px",
                width: "450px",
                margin: "10px auto 10px auto",
                height: "220px",
                alignItems: "center",
            }}>
                <div style={{ gridColumn: "1/3", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Typography variant="h6" component="div">
                        {s.serviceName}
                    </Typography>

                    <IconButton
                        onClick={handleClick}
                    >
                        <MoreVertIcon />
                    </IconButton>
                    <Menu
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
                        <MenuItem onClick={() => {
                            setEditMode(true);
                            setServiceToBeEdited(s);
                            handleClose()
                        }}>Edit</MenuItem>
                        <MenuItem>Delete</MenuItem>
                    </Menu>

                </div>

                <Typography style={{ gridColumn: "1/2" }} variant="body2" color="black">
                    {s.description}
                </Typography>
                <div style={{ gridColumn: "2/3", gridRow: "2/4", textAlign: 'right' }}>
                    <img style={{ width: "200px", height: "109.33px", paddingTop: "10px" }} src={s.serviceImage} alt={s.serviceName} />
                    <p>{s.price}</p>
                </div>

                <Typography style={{ gridColumn: "1/2" }} gutterBottom variant="subtitle2" component="div">
                    Estimated Time : {s.estimatedTime}
                </Typography>
            </div>
        </div >
    )
}