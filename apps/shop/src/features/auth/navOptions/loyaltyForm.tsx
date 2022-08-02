import { Button, Checkbox, FormControlLabel, FormGroup, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material'
import InputField from 'apps/shop/src/ui-components/Input'
import React, { CSSProperties, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'apps/shop/src/redux/store'
import { collection, deleteDoc, doc, getDocs, query, setDoc, updateDoc, where } from 'firebase/firestore'
import { db } from 'apps/shop/src/config/firebase'
import { addLoyalties, addLoyalty, loyaltyType } from 'apps/shop/src/redux/shops'
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import { Simplemodal } from 'apps/shop/src/components/modal'

const schema = yup.object({
    loyaltyName: yup.string().min(3).required(),
    minVisit: yup.number().positive(),
    maxVisit: yup.number().positive(),
    exactVisit: yup.number().positive(),
    minSpend: yup.number().positive(),
    maxSpend: yup.number().positive(),
    minDays: yup.number().positive(),
    maxDays: yup.number().positive(),
})

export const LoyaltyForm = () => {

    const dispatch = useDispatch()
    const { register, handleSubmit, setValue, formState: { errors }, setError, clearErrors } = useForm({ resolver: yupResolver(schema) });
    const { selectedShop, loyalties } = useSelector((state: RootState) => state.shop)
    const [minVisit, setMinVisit] = useState(false)
    const [maxVisit, setMaxVisit] = useState(false)
    const [exactVisit, setExactVisit] = useState(false)
    const [minSpend, setMinSpend] = useState(false)
    const [maxSpend, setMaxSpend] = useState(false)
    const [minDays, setMinDays] = useState(false)
    const [maxDays, setMaxDays] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editFormValue, setEditFormValue] = useState<loyaltyType | null>(null)

    const formInputStyles: CSSProperties = {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
    }

    async function getLoyalties() {
        if (selectedShop) {
            const ref = collection(db, "shops", selectedShop.id, "loyalties")
            const querySnapshot = await getDocs(ref)
            const result = querySnapshot.docs.map(doc => doc.data())
            if (result.length > 0) {
                dispatch(addLoyalties(result))
            }
        }
    }

    console.log(errors);


    const onsubmit = async (rawData: any) => {

        // required for update
        // remove fields with no value from Form Data (rawData)
        const data = Object.fromEntries(Object.entries(rawData).filter(([_, v]) => v != null)) as any
        console.log(data.id);

        const filtered = loyalties.filter((fl) => fl.id !== editFormValue?.id)
        if (Boolean(filtered.find((l: loyaltyType) => data.loyaltyName === l.loyaltyName))) {
            setError('loyaltyName', { message: "Loyalty Name can't be same", type: 'required' })
            return;
        } else {
            clearErrors('loyaltyName')
        }

        if (!editFormValue) {

            // Add Loyalty
            try {
                const id = `${data.loyaltyName.replace(" ", "-")}-${uuidv4()}`
                const targetData = {
                    ...data,
                    id,
                }
                if (selectedShop)
                    await setDoc(doc(db, `shops/${selectedShop.id}/loyalties`, id), targetData)
                dispatch(addLoyalty([...loyalties, targetData]))
                console.log(targetData);
            } catch (error) {
                console.log(error)
            }
        } else {

            // Update Loyalty
            try {
                const targetData = {
                    ...data,
                }
                const ref = doc(db, `shops/${selectedShop?.id}/loyalties`, editFormValue?.id)
                await updateDoc(ref, targetData);
            } catch (error) {
                console.log(error)
            }
        }

        handleModalClose()
    }

    const unChecked = (e: boolean, name: string) => {
        if (!e) {
            setValue(name, undefined)
        }
    }

    const handleModalClose = () => {
        setShowForm(false)
        setEditFormValue(null)
    }

    const editLoyalty = (l: loyaltyType) => {
        setEditFormValue(l)
        setShowForm(true)
        setValue("loyaltyName", l.loyaltyName)
        setValue("minVisit", l.minVisit)
        setValue("maxVisit", l.maxVisit)
        setValue("exactVisit", l.exactVisit)
        setValue("minSpend", l.minSpend)
        setValue("maxSpend", l.maxSpend)
        setValue("minDays", l.minDays)
        setValue("maxDays", l.maxDays)
        setMinVisit(Boolean(l.minVisit))
        setMaxVisit(Boolean(l.maxVisit))
        setExactVisit(Boolean(l.exactVisit))
        setMinSpend(Boolean(l.minSpend))
        setMaxSpend(Boolean(l.maxSpend))
        setMinDays(Boolean(l.minDays))
        setMaxDays(Boolean(l.maxDays))
    }

    const deleteLoyalty = async (l: loyaltyType) => {
        await deleteDoc(doc(db, `shops/${selectedShop?.id}/loyalties`, l.id));
    }

    useEffect(() => {
        getLoyalties()
    }, [editFormValue])


    return (
        <div>
            {loyalties.length < 3 && <div style={{ display: 'flex', alignItems: 'center' }}>
                <Typography>Add Loyalty</Typography>
                <IconButton onClick={() => setShowForm(true)}><ControlPointIcon color='primary' /></IconButton>
            </div>}

            <div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Min Visit</TableCell>
                                <TableCell align="right">Max Visit</TableCell>
                                <TableCell align="right">Exact Visit</TableCell>
                                <TableCell align="right">Min Spend</TableCell>
                                <TableCell align="right">Max Spend</TableCell>
                                <TableCell align="right">Min Days</TableCell>
                                <TableCell align="right">Max Days</TableCell>
                                <TableCell align="left">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loyalties.map((l: loyaltyType) => (
                                <TableRow
                                    key={l.id}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                    <TableCell component="th" scope="row">
                                        {l.loyaltyName}
                                    </TableCell>
                                    <TableCell align="right">{l.minVisit}</TableCell>
                                    <TableCell align="right">{l.maxVisit}</TableCell>
                                    <TableCell align="right">{l.exactVisit}</TableCell>
                                    <TableCell align="right">{l.minSpend}</TableCell>
                                    <TableCell align="right">{l.maxSpend}</TableCell>
                                    <TableCell align="right">{l.minDays}</TableCell>
                                    <TableCell align="right">{l.maxDays}</TableCell>
                                    <TableCell align="right">
                                        <Button variant='outlined'
                                            onClick={() => editLoyalty(l)}>Edit</Button>
                                        <Button variant='outlined' color='error'
                                            onClick={() => deleteLoyalty(l)}>Delete</Button>
                                    </TableCell>


                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>

            <Simplemodal style={{ height: "55vh" }} onClose={handleModalClose} open={showForm}>

                <form onSubmit={handleSubmit(onsubmit)}>

                    <div style={formInputStyles}>
                        <label>Loyalty Name: </label>
                        <InputField placeholder='Program Name'
                            forminput={{ ...register("loyaltyName") }}
                            helperText={errors['loyaltyName']?.message}
                            error={Boolean(errors['loyaltyName'])}
                        />
                    </div>

                    <Typography textAlign={'left'}>Visit: </Typography>
                    <div style={formInputStyles}>
                        <FormControlLabel control={
                            <Checkbox checked={minVisit} disabled={exactVisit}
                                onChange={(e) => { setMinVisit(e.target.checked); unChecked(e.target.checked, "minVisit") }} />
                        } label="Minimum Visit" />
                        <InputField disabled={!minVisit || exactVisit} placeholder='Min Visit'
                            forminput={{ ...register("minVisit") }}
                        />
                    </div>
                    <div style={formInputStyles}>
                        <FormControlLabel control={
                            <Checkbox checked={maxVisit} disabled={exactVisit}
                                onChange={(e) => { setMaxVisit(e.target.checked); unChecked(e.target.checked, "maxVisit") }} />
                        } label="Maximum Visit" />
                        <InputField disabled={!maxVisit || exactVisit} placeholder='Max Visit'
                            forminput={{ ...register("maxVisit") }}
                        />
                    </div>
                    <div style={formInputStyles}>
                        <FormControlLabel control={
                            <Checkbox checked={exactVisit} disabled={minVisit || maxVisit}
                                onChange={(e) => { setExactVisit(e.target.checked); unChecked(e.target.checked, "exactVisit") }} />
                        } label="Exact Visit" />
                        <InputField disabled={!exactVisit} placeholder='Exact Visit'
                            forminput={{ ...register("exactVisit") }}
                        />
                    </div>

                    <Typography textAlign={'left'}>Spend: </Typography>
                    <div style={formInputStyles}>
                        <FormControlLabel control={
                            <Checkbox checked={minSpend}
                                onChange={(e) => { setMinSpend(e.target.checked); unChecked(e.target.checked, "minSpend") }} />
                        } label="Minimun Spend" />
                        <InputField disabled={!minSpend} placeholder='Min Spend'
                            forminput={{ ...register("minSpend") }}
                        />
                    </div>
                    <div style={formInputStyles}>
                        <FormControlLabel control={
                            <Checkbox checked={maxSpend}
                                onChange={(e) => { setMaxSpend(e.target.checked); unChecked(e.target.checked, "maxSpend") }} />
                        } label="Maximum Spend" />
                        <InputField disabled={!maxSpend} placeholder='Max Spend'
                            forminput={{ ...register("maxSpend") }}
                        />
                    </div>

                    <Typography textAlign={'left'}>Days: </Typography>
                    <div style={formInputStyles}>
                        <FormControlLabel control={
                            <Checkbox checked={minDays}
                                onChange={(e) => { setMinDays(e.target.checked); unChecked(e.target.checked, "minDays") }} />
                        } label="Minimum Days" />
                        <InputField disabled={!minDays} placeholder='Min Days'
                            forminput={{ ...register("minDays") }}
                        />
                    </div>
                    <div style={formInputStyles}>
                        <FormControlLabel control={
                            <Checkbox checked={maxDays}
                                onChange={(e) => {
                                    setMaxDays(e.target.checked)
                                    unChecked(e.target.checked, "maxDays")
                                }} />
                        } label="Maximum Days" />
                        <InputField disabled={!maxDays} placeholder='Max Days'
                            forminput={{ ...register("maxDays") }}
                        />
                    </div>

                    <Button variant="outlined" onClick={handleModalClose}>Cancel</Button>
                    <Button variant="contained" type='submit'>Submit</Button>

                </form>

            </Simplemodal>

        </div >

    )
}
