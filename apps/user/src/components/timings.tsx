import { Chip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { doc, getDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { db } from '../configs/firebaseConfig'
import { RootState } from '../redux/store/store'

type Props = {}

export const Timings = (props: Props) => {

    const { shopId } = useParams()
    // const {selectedShopId} = useSelector((state: RootState)=> state.appSlice)
    const [fetchedShop, setFetchedShop] = useState<any>(null)

    async function getShopDetails() {
        if (shopId) {
            const docRef = doc(db, "shops", shopId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                setFetchedShop(docSnap.data())
            } else {
                console.log("No such document!");
            }
        }
    }

    useEffect(() => {
        getShopDetails()
    }, [])

    console.log(shopId);
    
    console.log(fetchedShop);

    return (
        <div>
            <Typography variant='h6' sx={{textAlign: "center"}}>Timings</Typography>
            {fetchedShop && fetchedShop.timings.map((fs: any) =>
                <Box  sx={{display: "flex", alignItems:"center", justifyContent: "space-around"}}>
                    <Chip sx={{width: '15ch'}} label={fs.day} />
                    <p>{fs.from.toDate().toLocaleTimeString()}</p>
                    <p>{fs.to.toDate().toLocaleTimeString()}</p>
                </Box>
            )}
        </div>
    )
}