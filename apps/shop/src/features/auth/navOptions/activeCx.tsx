import { Box, Button, FormControl, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material'
import { db } from 'apps/shop/src/config/firebase';
import { RootState } from 'apps/shop/src/redux/store';
import { collection, getDocs, orderBy, query, serverTimestamp, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';

export const Activecustomers = () => {

    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const [allActiveCx, setAllActiveCx] = useState<any>([])
    const [activeCx, setActiveCx] = useState<any>([])

    // Filter input
    const [selectFilter, setSelectFilter] = React.useState('name');
    const [filterValue, setFilterValue] = React.useState('');
    const filterSelect = (event: SelectChangeEvent) => {
        setSelectFilter(event.target.value as string);
    };
    const filterInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFilterValue(event.target.value);
    };

    const resetFilter = () => {
        setFilterValue('')
        setSelectFilter('name')
        setActiveCx(allActiveCx)
    }

    async function getCustomers() {
        let timeNow = new Date()
        timeNow.setHours(timeNow.getHours() - 4)
        if (selectedShop) {
            const ref = collection(db, "users")
            const q = query(ref, where("timeStamp", ">=", timeNow), orderBy("timeStamp"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
            setAllActiveCx(result)
            setActiveCx(result)
        }
    }

    const filterActiveCx = () => {
        if (selectFilter === 'phoneNumber') {
            if (filterValue.length !== 13) {
                setFilterValue(`+91${filterValue}`)
            }
        }

        const result = allActiveCx.filter((fc: any) => fc[`${selectFilter}`] === filterValue)
        setActiveCx(result)
    }

    useEffect(() => {
        getCustomers()
    }, [])

    return (
        <div>
            <Typography> Active Customers </Typography>

            {/* Filter inputs */}
            <div style={{ display: "flex", padding: '10px 10px', gap: '5px' }}>
                <Box sx={{ width: "200px" }}>
                    <FormControl fullWidth>
                        <Select
                            value={selectFilter}
                            onChange={filterSelect}
                        >
                            <MenuItem value={"name"}>Name</MenuItem>
                            <MenuItem value={"phoneNumber"}>Phone Number</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <TextField sx={{ width: "200px" }}
                    value={filterValue} onChange={filterInput}
                />

                <Button variant='outlined'
                    onClick={() => {
                        if ((selectFilter && filterValue) !== '')
                            filterActiveCx()
                    }}>
                    Filter
                </Button>
                <Button variant='outlined' onClick={resetFilter}>Reset</Button>

            </div>

            {activeCx.length > 0 ?
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell align="left">Name</TableCell>
                                <TableCell align="left">Phone Number</TableCell>
                                <TableCell align="left">Time</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {activeCx.map((c: any) => (
                                <TableRow key={c.id}>
                                    <TableCell component="th" scope="row">
                                        {c.name}
                                    </TableCell>
                                    <TableCell align="left">{c.phoneNumber}</TableCell>
                                    <TableCell align="left">{c.timeStamp.toDate().toLocaleString()}</TableCell>
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