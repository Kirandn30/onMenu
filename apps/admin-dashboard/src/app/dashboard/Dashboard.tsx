import React, { useState } from 'react'
import { Button, MenuItem, TextField } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { ShopsTable } from './shopsTable'
import { FilterComponent } from './filterComponent';

export const Dashboard = () => {
    const navigate = useNavigate()
    const [filterValue, setFilterValue] = useState<string | null>(null)
    const [filter, setFilter] = useState("shopName")

    return (
        <div style={{ backgroundColor: "#F6F7FA", height: "80vh", textAlign: "right" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "20px 50px" }}>
                <FilterComponent setFilterValue={setFilterValue} filter={filter} setFilter={setFilter} filterValue={filterValue} />
                <Button variant='contained' onClick={() => navigate("/add")}>Add Shops</Button>
            </div>
            <ShopsTable filterValue={filterValue} filter={filter} />
        </div >
    )
}
