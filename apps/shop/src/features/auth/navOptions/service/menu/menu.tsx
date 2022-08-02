import { Chip, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { menuType, setMenu } from 'apps/shop/src/redux/services'
import React, { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'apps/shop/src/redux/store';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from 'apps/shop/src/config/firebase';

type Props = {
    m: menuType
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    setMenuToBeEdited: React.Dispatch<React.SetStateAction<menuType | null>>
}

export default function MenuItemComponent({ m, setEditMode, setMenuToBeEdited }: Props) {

    // options butons
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
    const { selectedMenu, menu } = useSelector((state: RootState) => state.branches)

    // Styles
    const menuStyles: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        paddingLeft: "10px",
        background: selectedMenu?.id === m.id ? "#0094FF" : "",
        color: selectedMenu?.id === m.id ? "white" : "",
        borderRadius: 10,
    }

    // Change menu status
    const changeMenuStatus = async (statusParam: string) => {

        const target = menu.find((tm: any) => tm.id === m.id)
        if (target) {
            const targetIndex = menu.findIndex((tm: any) => tm.id === m.id)
            if (selectedShop) {
                const ref = doc(db, "shops", selectedShop.id, "menu", m.id)
                await updateDoc(ref, { status: statusParam })
            }
            const copyMenu = [...menu]
            copyMenu.splice(targetIndex, 1, { ...target, status: statusParam })
            dispatch(setMenu(copyMenu))
        }
    }

    // Delete status and update indices
    async function deleteMenu() {
        try {
            const up = menu.filter((fm: menuType) => fm.index < m.index)
            const down = menu.filter((fm: menuType) => fm.index > m.index).map((dm: menuType) => ({
                ...dm, index: dm.index - 1
            }))
            const batch = writeBatch(db)
            if (selectedShop) {
                const ref = doc(db, "shops", selectedShop.id, "menu", m.id)
                batch.update(ref, { status: "deleted" })
                down.forEach(async (dm: any) => {
                    const branchesRef = doc(db, "shops", selectedShop.id, "menu", dm.id);
                    batch.update(branchesRef, {
                        index: dm.index,
                    })
                })
                await batch.commit()
                dispatch(setMenu([...up, ...down]))
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div style={menuStyles}>
            <Typography variant='h6' component="div" sx={{ display: "flex", alignItems: "center" }}>
                {m.status === "unpublished" ?
                    <Chip sx={{ margin: "10px" }} color="error" label="U" variant="outlined" />
                    :
                    <>
                        {m.status === "created" ?
                            <Chip sx={{ margin: "10px" }} color="info" label="C" variant="outlined" />
                            :
                            <div style={{ width: 56 }} />
                        }
                    </>
                }
                {m.menuName}
            </Typography>

            {/* Option button */}
            <div>
                <IconButton
                    id={m.id}
                    onClick={handleClick}
                    sx={{ color: selectedMenu?.id === m.id ? "white" : "black", }}
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
                    {m.status === "published" ?
                        <MenuItem onClick={() => changeMenuStatus("unpublished")}>Unpublish</MenuItem> :
                        <MenuItem onClick={() => changeMenuStatus("published")}>Publish</MenuItem>
                    }
                    <MenuItem onClick={() => { setEditMode(true); setMenuToBeEdited(m); handleClose() }}>Edit</MenuItem>
                    <MenuItem onClick={deleteMenu}>
                        Delete
                    </MenuItem>
                </Menu>

            </div>
        </div>
    )
}