import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { db } from 'apps/shop/src/config/firebase'
import { RootState } from 'apps/shop/src/redux/store'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'

export const Servicealert = () => {

    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const [feedbacks, setFeedbacks] = useState<any>([])

    async function getFeedbacks() {
        
        if (selectedShop) {
            const ref = collection(db, "shops", selectedShop.id, "feedbacks")
            const q = query(ref, orderBy("timeStamp"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
            console.log(result);
            
            setFeedbacks(result)
        }
    }

    useEffect(() => {
      getFeedbacks()
      console.log("check");
      
    }, [])
    

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            {/* <TableCell>Dessert (100g serving)</TableCell> */}
                            <TableCell align="left">Experience Rating</TableCell>
                            <TableCell align="left">Feedback</TableCell>
                            <TableCell align="left">Name</TableCell>
                            <TableCell align="left">Contact</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedbacks.map((f: any) => (
                            <TableRow
                                key={f.id}
                                // sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {/* <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell> */}
                                <TableCell align="left">{f.experienceRating}</TableCell>
                                <TableCell align="left">{f.feedback}</TableCell>
                                <TableCell align="left">{f.name}</TableCell>
                                <TableCell align="left">{f.phoneNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
