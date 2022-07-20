import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../configs/firebaseConfig'
import { branchesType, setBranches, setSelectedBranch } from '../redux/appSlice'
import { RootState } from '../redux/store/store'

export const Branches = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { shopId } = useParams()
    
    const { branches } = useSelector((state: RootState) => state.appSlice)

    async function getBranches() {
        if (shopId) {
            const ref = collection(db, "shops", shopId, "branches")
            const q = query(ref, orderBy("index"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
            dispatch(setBranches(result))
        }
    }

    useEffect(() => {
        getBranches()
    }, [shopId])

    const handleCardClick = (branch: branchesType)=>{
        dispatch(setSelectedBranch(branch))
        navigate(`/${shopId}/${branch.id}`)   
    }

    console.log();
    
    const branchStyles:React.CSSProperties ={
        maxWidth: 345,
        margin: "auto"
    }
    
    return (
        <div>
            {branches.map((b: branchesType) => (
                <Card key={b.id} sx={branchStyles} onClick={()=>handleCardClick(b)}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image="https://firebasestorage.googleapis.com/v0/b/on-menu-phase-2.appspot.com/o/uploads%2FEYcKX7knbKaQnyBN8BiB75fZX4f2%2Fimages%2Fimage.jpeg?alt=media&token=30204833-74e9-42d2-a75d-79cda0c917bd"
                            alt={b.branchName + " image"}
                        />
                        <CardContent>
                            <Typography variant="h5" component="div">
                                <LocationOnIcon/>
                                {b.branchName}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </div>
    )
}
