import { Button, Card, CardActions, CardContent, CardMedia, Chip, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { serviceType, setServices } from 'apps/shop/src/redux/services'
import React, { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'apps/shop/src/redux/store';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from 'apps/shop/src/config/firebase';

type Props = {
    s: serviceType
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setServiceToBeEdited: React.Dispatch<React.SetStateAction<serviceType | null>>
}

export default function ServiceCard({ s, setEditMode, setServiceToBeEdited }: Props) {

    // option button
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget)
    }
    const handleClose = () => {
        setAnchorEl(null)
    }

    const dispatch = useDispatch()
    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const { services } = useSelector((state: RootState) => state.branches)

    async function changeServiceStatus(statusParam: string) {
        const target = services.find((ts: any) => ts.id === s.id)
        if (target) {
            const targetIndex = services.findIndex((ts: any) => ts.id === s.id)
            if (selectedShop) {
                const ref = doc(db, "shops", selectedShop.id, "services", s.id)
                await updateDoc(ref, { status: statusParam })
            }
            const copyMenu = [...services]
            copyMenu.splice(targetIndex, 1, { ...target, status: statusParam })
            dispatch(setServices(copyMenu))
        }

        handleClose() // Close option button
    }

    // Delete status and update indices
    async function deleteService() {
        try {
            const up = services.filter((fs: serviceType) => fs.index < s.index)
            const down = services.filter((fs: serviceType) => fs.index > s.index).map((ds: serviceType) => ({
                ...ds, index: ds.index - 1
            }))
            const batch = writeBatch(db)
            if (selectedShop) {
                const ref = doc(db, "shops", selectedShop.id, "services", s.id)
                batch.update(ref, { status: "deleted" })
                down.forEach(async (dm: any) => {
                    const branchesRef = doc(db, "shops", selectedShop.id, "menu", dm.id);
                    batch.update(branchesRef, {
                        index: dm.index,
                    })
                })
                await batch.commit()
                dispatch(setServices([...up, ...down]))
            }
        } catch (error) {
            console.log(error);
        }
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
                    <Typography variant="h6" component="div" sx={{ display: "flex", alignItems: "center" }}>
                        {s.serviceName}
                        {s.status === "unpublished" &&
                            <Chip sx={{ margin: "10px" }} color="error" label="Unpublished" variant="outlined" />}
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
                        {s.status === "published" ?
                            <MenuItem onClick={() => changeServiceStatus("unpublished")}>Unpublish</MenuItem> :
                            <MenuItem onClick={() => changeServiceStatus("published")}>Publish</MenuItem>
                        }
                        <MenuItem onClick={() => {
                            setEditMode(true);
                            setServiceToBeEdited(s);
                            handleClose()
                        }}>Edit</MenuItem>
                        <MenuItem onClick={deleteService}>Delete</MenuItem>
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