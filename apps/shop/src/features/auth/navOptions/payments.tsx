import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { db } from 'apps/shop/src/config/firebase';
import { paymentsType } from 'apps/shop/src/redux/shops';
import { RootState } from 'apps/shop/src/redux/store';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

export const Payments = () => {

    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const [allPayments, setAllPayments] = useState<Array<any>>([])
    const [paymentsDetails, setPaymentsDetails] = useState<Array<any>>([])

    // Filter input
    const [selectFilter, setSelectFilter] = React.useState('name');
    const [filterValue, setFilterValue] = React.useState('');
    const filterSelect = (event: SelectChangeEvent) => {
        setSelectFilter(event.target.value as string);
    };
    const filterInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    async function getPayments() {
        if (selectedShop) {
            const ref = collection(db, "shops", selectedShop.id, "payments")
            const q = query(ref, orderBy("timeStamp"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
            setAllPayments(result)
            setPaymentsDetails(result)
        }
    }

    const filterPayments = () => {
        if (selectFilter === 'contact') {
            if (filterValue.length !== 13) {
                setFilterValue(`+91${filterValue}`)
            }
        }

        const result = allPayments.filter((fp) => fp[`${selectFilter}`] === filterValue)
        setPaymentsDetails(result)
    }

    const resetFilter = () => {
        setFilterValue('')
        setSelectFilter('name')
        setPaymentsDetails(allPayments)
    }

    useEffect(() => {
        getPayments()
    }, [])

    return (
        <div>

            {/* Filter inputs */}
            <div style={{ display: "flex", padding: '10px 10px', gap: '5px' }}>
                <Box sx={{ width: "200px" }}>
                    <FormControl fullWidth>
                        <Select
                            value={selectFilter}
                            onChange={filterSelect}
                        >
                            <MenuItem value={"name"}>Name</MenuItem>
                            <MenuItem value={"amount"}>Amount</MenuItem>
                            <MenuItem value={"contact"}>Phone Number</MenuItem>
                            <MenuItem value={"status"}>Status</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {/* TABLE */}
                {selectFilter !== "status" ?
                    <TextField sx={{ width: "200px" }}
                        value={filterValue} onChange={filterInput}
                    />
                    :
                    <FormControl sx={{ width: "200px" }}>
                        <Select
                            value={selectFilter}
                            onChange={filterSelect}
                        >
                            <MenuItem value={"success"}>Success</MenuItem>
                            <MenuItem value={"failed"}>Failed</MenuItem>
                        </Select>
                    </FormControl>
                }

                <Button variant='outlined'
                    onClick={() => {
                        if ((selectFilter && filterValue) !== '')
                            filterPayments()
                    }}>
                    Filter
                </Button>
                <Button variant='outlined' onClick={resetFilter}>Reset</Button>

            </div>

            {paymentsDetails.length > 0 ?
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
                :
                <Typography component={'div'} sx={{ textAlign: "center", margin: "10px" }} variant='subtitle1'>
                    No data available!
                </Typography>
            }

        </div>
    )
}
