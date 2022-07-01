import React, { useState } from 'react'
import { Button, MenuItem, TextField } from '@mui/material'
import { debounce } from 'lodash';

type FilterComponentProps = {
    setFilterValue: React.Dispatch<React.SetStateAction<string | null>>
    setFilter: React.Dispatch<React.SetStateAction<string>>
    filter: string
    filterValue: string | null
}


export const FilterComponent = ({ setFilterValue, filter, setFilter, filterValue }: FilterComponentProps) => {

    const changed = debounce((text) => {
        setFilterValue(text)
    }, 1500)

    return (
        <div style={{ display: "flex", gap: "20px" }}>
            <TextField
                id="outlined-select-currency"
                select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                size='small'
            >
                {filterValues.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.name}
                    </MenuItem>
                ))}
            </TextField>
            <TextField onChange={(e) => changed(e.target.value)} placeholder="Filter" size='small' />
            <Button variant='outlined' onClick={() => setFilterValue(null)}>Reset</Button>

        </div>
    )
}

const filterValues = [
    {
        name: "Shop Name",
        value: "shopName"
    },
    {
        name: "Admin Email",
        value: "adminEmail"
    },
    {
        name: "Area",
        value: "area"
    }
];