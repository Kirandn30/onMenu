import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { db } from 'apps/shop/src/config/firebase';
import { paymentsType } from 'apps/shop/src/redux/shops';
import { RootState } from 'apps/shop/src/redux/store';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

export const Payments = () => {

    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const [paymentsDetails, setPaymentsDetails] = useState<Array<any>>([])

    async function getPayments() {
        if (selectedShop) {
            const ref = collection(db, "shops", selectedShop.id, "payments")
            const q = query(ref, orderBy("timeStamp"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
            result.map(r=> console.log(r["timeStamp"].toDate().toLocaleString()))
            setPaymentsDetails(result)
        }
    }

    useEffect(()=>{
        getPayments()
    }, [])

    return (
        <div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell align="right">Time</TableCell>
                            <TableCell align="right">Status</TableCell>
                            <TableCell align="right">Customer Name</TableCell>
                            <TableCell align="right">Customer Contact</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paymentsDetails.map((p: paymentsType) => (
                            <TableRow
                                key={p.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {p.id}
                                </TableCell>
                                <TableCell align="right">{p.amount}</TableCell>
                                <TableCell align="right">{p.timeStamp.toDate().toLocaleString()}</TableCell>
                                <TableCell align="right">{p.status}</TableCell>
                                <TableCell align="right">{p.name}</TableCell>
                                <TableCell align="right">{p.contact}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
