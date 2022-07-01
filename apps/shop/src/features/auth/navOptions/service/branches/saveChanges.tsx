import React from 'react'
import { Button } from "@mui/material";
import { useTransition, animated } from "react-spring"
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../../redux/store';
import { doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../../../config/firebase';
import { useParams } from 'react-router-dom';
import { branchesType, setBranch, setLoading } from '../../../../../redux/services';
import { setError, setNotification } from '../../../../../redux/auth';

type savechangesProps = {
    setIsReodrded: React.Dispatch<React.SetStateAction<boolean>>
    isReodrded: boolean
    localBranches: branchesType[]
    setLocalBranches: React.Dispatch<React.SetStateAction<branchesType[]>>
}

export const SaveChanges = ({ setIsReodrded, isReodrded, localBranches, setLocalBranches }: savechangesProps) => {
    const transition = useTransition(isReodrded, {
        from: { x: 0, y: -100, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
        leave: { x: 0, y: -100, opacity: 0 }
    })
    const { branches, loading } = useSelector((state: RootState) => state.branches)
    const { shopid } = useParams()
    const dispatch = useDispatch()

    const save = async () => {
        try {
            dispatch(setLoading(true))
            const batch = writeBatch(db)
            if (!shopid) return
            localBranches.forEach(branch => {
                const branchesRef = doc(db, "roles", shopid, "branches", branch.id);
                batch.update(branchesRef, {
                    index: branch.index
                })
            })
            await batch.commit()
            dispatch(setBranch(localBranches))
            dispatch(setLoading(false))
            setIsReodrded(false)
            dispatch(setNotification("Branches updated successfully"))
        } catch (error: any) {
            dispatch(setError(error.message))
        }
    }

    return (
        <div style={{ position: "absolute", left: "40%" }}>
            {transition((style, item) =>
                item && <animated.div style={{ ...style, textAlign: "center", width: "20vw", margin: "auto", boxShadow: "0px 9px 9px rgba(229, 229, 229, 0.3)", backgroundColor: "white", padding: "15px", borderRadius: "0px 0px 10px 10px" }}>
                    Save changes
                    <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "10px" }}>
                        <Button onClick={() => { setIsReodrded(false); setLocalBranches(branches) }} variant="outlined" size="small">cancel</Button>
                        <Button disabled={loading} onClick={save} variant="contained" size="small">save</Button>
                    </div>
                </animated.div>
            )}
        </div>
    )
}
