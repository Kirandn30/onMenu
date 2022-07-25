import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { db } from 'apps/shop/src/config/firebase'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export const Servicealert = () => {

    const { shopId } = useParams()
    const [feedbacks, setFeedbacks] = useState<any>([])

    async function getFeedbacks() {
        if (shopId) {
            const ref = collection(db, "shops", shopId, "feedbacks")
            const q = query(ref, orderBy("timeStamp"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
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
                            <TableCell align="right">Experience Rating</TableCell>
                            <TableCell align="right">Feedback</TableCell>
                            <TableCell align="right">Name</TableCell>
                            <TableCell align="right">Contact</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {feedbacks.map((f: any) => (
                            <TableRow
                                key={f.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                {/* <TableCell component="th" scope="row">
                                    {row.name}
                                </TableCell> */}
                                <TableCell align="right">{f.experienceRating}</TableCell>
                                <TableCell align="right">{f.feedback}</TableCell>
                                <TableCell align="right">{f.name}</TableCell>
                                <TableCell align="right">{f.phoneNumber}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
