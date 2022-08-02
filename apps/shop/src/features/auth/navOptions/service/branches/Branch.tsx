import { Chip, IconButton, Menu, MenuItem, Typography } from '@mui/material'
import { addBranches, branchesType, setBranch, setBranches } from 'apps/shop/src/redux/services'
import React, { useState } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'apps/shop/src/redux/store';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from 'apps/shop/src/config/firebase';

type Props = {
    b: branchesType,
    setBranchToBeEdited: React.Dispatch<React.SetStateAction<branchesType | null>>,
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
}

export const Branch = ({ b, setEditMode, setBranchToBeEdited }: Props) => {

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
    const { selectedBranch, branches } = useSelector((state: RootState) => state.branches)

    // Change menu status
    const changeMenuStatus = async (statusParam: string) => {

        const target = branches.find((tb: any) => tb.id === b.id)
        if (target) {
            const targetIndex = branches.findIndex((tm: any) => tm.id === b.id)
            if (selectedShop) {
                const ref = doc(db, "shops", selectedShop.id, "branches", b.id)
                await updateDoc(ref, { status: statusParam })
            }
            const copyMenu = [...branches]
            copyMenu.splice(targetIndex, 1, { ...target, status: statusParam })
            dispatch(setBranch(copyMenu))
        }
    }

    // Delete status and update indices
    async function deleteMenu() {
        try {
            const up = branches.filter((fb: branchesType) => fb.index < b.index)
            const down = branches.filter((fb: branchesType) => fb.index > b.index).map((mdb: branchesType) => ({
                ...mdb, index: mdb.index - 1
            }))
            const batch = writeBatch(db)
            if (selectedShop) {
                const ref = doc(db, "shops", selectedShop.id, "branches", b.id)
                batch.update(ref, { status: "deleted" })
                down.forEach(async (fdb: any) => {
                    const branchesRef = doc(db, "shops", selectedShop.id, "branches", fdb.id);
                    batch.update(branchesRef, {
                        index: fdb.index,
                    })
                })
                await batch.commit()
                dispatch(setBranches([...up, ...down]))
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div style={{ display: "flex", justifyContent: 'space-around', alignItems: 'center', height: "40px" }}>

            <Typography component={'div'}>
                {b.status === "unpublished" ?
                    <Chip sx={{ margin: "0px 10px" }} color="error" label="U" variant="outlined" />
                    :
                    <>
                        {b.status === "created" ?
                            <Chip sx={{ margin: "0px 10px" }} color="info" label="C" variant="outlined" />
                            :
                            <div style={{ width: 56 }} />
                        }
                    </>
                }
                {b.branchName}
            </Typography>

            {/* Option button */}
            <div>
                <IconButton
                    id={b.id}
                    onClick={handleClick}
                    sx={{ color: selectedBranch?.id === b.id ? "white" : "black", padding: 0 }}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id={b.id}
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    PaperProps={{
                        style: {
                            width: '12ch',
                        },
                    }}
                >
                    {b.status === "published" ?
                        <MenuItem onClick={() => changeMenuStatus("unpublished")}>Unpublish</MenuItem> :
                        <MenuItem onClick={() => changeMenuStatus("published")}>Publish</MenuItem>
                    }
                    <MenuItem onClick={() => { setEditMode(true); setBranchToBeEdited(b); handleClose() }}>Edit</MenuItem>
                    <MenuItem onClick={deleteMenu}>Delete</MenuItem>
                </Menu>

            </div>
        </div>
    )
}