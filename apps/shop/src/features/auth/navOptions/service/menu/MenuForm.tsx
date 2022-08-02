import { Button, Checkbox, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import InputField from '../../../../../ui-components/Input'
import add from "../../../../../assets/add.svg"
import React, { useEffect, useState } from 'react'
import { MiuracImage } from '@on-menu/miurac-image'
import { app, db } from '../../../../../config/firebase'
import { Login } from '../../../login'
import { CloudUploadOutlined } from '@mui/icons-material'
import { TimePicker } from '@mui/x-date-pickers'
import _ from "lodash"
import { useForm } from 'react-hook-form'
import { v4 as uuidv4 } from 'uuid';
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'apps/shop/src/redux/store'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { Simplemodal } from 'apps/shop/src/components/modal'
import { menuType, setMenu } from 'apps/shop/src/redux/services'

const schema = yup.object({
    menuName: yup.string().min(4, "Minimum 4 characters is required").required("Menu name is required"),
})
type MenuForm = {
    editMode: Boolean
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    menuToBeEdited: menuType | null
}

export const MenuForm = ({ editMode, setEditMode, menuToBeEdited }: MenuForm) => {

    const theme = useTheme()
    const media = useMediaQuery(theme.breakpoints.up('lg'))
    const dispatch = useDispatch()
    const { menu } = useSelector((state: RootState) => state.branches)
    const { register, handleSubmit, setValue, clearErrors, formState: { errors }, setError } = useForm({ resolver: yupResolver(schema) });
    const [showMenuForm, setShowMenuForm] = useState(false)
    const [menuImage, setMenuImage] = useState<string | null>(null)
    const [selectedTiming, setSelectedTiming] = useState<any>([])
    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const { selectedBranch } = useSelector((state: RootState) => state.branches)
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    useEffect(() => {
        if (editMode) {
            setShowMenuForm(true)
            if (menuToBeEdited) {
                setValue("menuName", menuToBeEdited.menuName)
                setMenuImage(menuToBeEdited?.img)
                const timings = menuToBeEdited.timings.map(({ day, from, to }) => ({ day, from: new Date(from), to: new Date(to) }))
                setSelectedTiming(timings)
            }
        }
    }, [editMode])

    const onsubmit = async (data: any) => {
        // validate
        if (selectedTiming.length === 0) {
            setError('timing', { message: "atleast one time required", type: 'required' })
            return;
        } else {
            clearErrors('timing')
        }
        if (!menuImage) {
            setError('menuImage', { message: "Menu image is required", type: 'required' })
            return;
        } else {
            clearErrors('menuImage')
        }

        //Create menu
        if (!editMode) {
            try {
                const id = `${data.menuName.replace(" ", "-")}-${uuidv4()}`
                const targetData = {
                    ...data,
                    id,
                    img: menuImage,
                    timings: selectedTiming,
                    status: 'created',
                    shopId: selectedShop?.id,
                    branchId: selectedBranch?.id,
                    index:menu.length
                }
                if (selectedShop)
                    await setDoc(doc(db, `shops/${selectedShop.id}/menu`, id), targetData)
                dispatch(setMenu([...menu, targetData]))
                console.log(targetData);

            } catch (error) {
                console.log(error)
            }
        }

        // Update menu
        try {
            const targetData = {
                ...data,
                img: menuImage,
                timings: selectedTiming,
                status: 'created',
                shopId: selectedShop?.id,
                branchId: selectedBranch?.id,
            }
            if (menuToBeEdited) {
                const ref = doc(db, `shops/${selectedShop?.id}/menu`, menuToBeEdited?.id)
                await updateDoc(ref, targetData);
            }
        } catch (error) {
            console.log(error)
        }

        handleModalClose()
    }

    // From close and clear
    const handleModalClose = () => {
        setShowMenuForm(false)
        setEditMode(false)
        setValue("menuName", "")
        setMenuImage(null)
        setSelectedTiming([])
    }

    return (
        <div>
            {/* Top */}
            <div style={{ display: "grid", gridTemplateColumns: "11fr 1fr", alignItems: "center" }}>
                <Typography align='center' variant='h6'> Menus</Typography>
                <img onClick={() => setShowMenuForm(true)} className='add' src={add} alt="add" />
            </div>

            {/* Menu Form */}
            <Simplemodal style={{ height: "55vh" }} onClose={handleModalClose} open={showMenuForm}>

                <Typography align='center' variant='h6'>MenuForm</Typography>

                <form onSubmit={handleSubmit(onsubmit)}>
                    <div style={{
                        display: "grid", gridTemplateColumns: media ? "2fr 4fr" : "1fr",
                        marginTop: "30px", alignItems: "center", gap: "15px", justifyItems: "left"
                    }}>

                        <div>
                            <label>Menu Name:</label>
                        </div>
                        <div>
                            <InputField placeholder='Menu Name' fullWidth
                                forminput={{ ...register("menuName") }}
                                helperText={errors['menuName']?.message}
                                error={Boolean(errors['menuName'])}
                            />
                        </div>

                        <div style={{ alignSelf: "start" }}>
                            Upload Image:
                        </div>
                        <div>
                            <div >
                                {menuImage ? (
                                    <img width="450px" height="150px" src={menuImage} alt="menu" />
                                ) : (
                                    <MiuracImage app={app} authComponent={<Login />} buttonComponent={<Upload />}
                                        updateFirestore={true} editConfig={{ aspectX: 3, aspectY: 1 }}
                                        setUrlFunc={(url) => setMenuImage(url)} />
                                )}
                                <div>
                                    <Typography color={'error'} >
                                        {errors['menuImage']?.message}
                                    </Typography>
                                </div>
                            </div>
                        </div>

                        {/* Days and timepicker  */}
                        {days.map((day) => (
                            <React.Fragment key={day} >
                                <div>
                                    <Checkbox sx={{ color: "black" }}
                                        checked={_.find(selectedTiming, { day })}
                                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                            if (event.target.checked) {
                                                setSelectedTiming([...selectedTiming,
                                                { day, from: new Date(new Date().setHours(9, 0, 0)), to: new Date(new Date().setHours(17, 0, 0)) }])
                                            } else {
                                                setSelectedTiming(_.filter(selectedTiming, d => d.day !== day))
                                            }
                                        }}
                                    />
                                    <label>{day}</label>
                                </div>

                                <div style={{ display: "flex" }}>
                                    {_.find(selectedTiming, { day }) && <>
                                        <TimePicker
                                            value={_.find(selectedTiming, { day }).from}
                                            onChange={(newValue: Date | null) => {
                                                const target = _.find(selectedTiming, { day })
                                                const modified = { ...target, from: newValue }
                                                const filteredTimings = selectedTiming.filter((d: any) => d.day !== day)
                                                setSelectedTiming([...filteredTimings, modified])

                                            }}
                                            renderInput={(params) => <InputField {...params} />}
                                        />
                                        <TimePicker
                                            value={_.find(selectedTiming, { day }).to}
                                            onChange={(newValue: Date | null) => {
                                                const target = _.find(selectedTiming, { day })
                                                const modified = { ...target, to: newValue }
                                                const filteredTimings = selectedTiming.filter((d: any) => d.day !== day)
                                                setSelectedTiming([...filteredTimings, modified])
                                            }}
                                            renderInput={(params) => <InputField {...params} />}
                                        /></>
                                    }
                                </div>
                            </React.Fragment>
                        ))}
                        <div>
                            <Typography color={'error'} >
                                {errors['timing']?.message}
                            </Typography>
                        </div>
                    </div>

                    <div style={{ marginTop: "10px" }}>
                        <Button sx={{ margin: "0px 10px" }} variant='contained' type='submit'>Submit</Button>
                        <Button sx={{ margin: "0px 10px" }} onClick={handleModalClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </Simplemodal>

        </div>
    )
}

// Image upload botton
const Upload = () => {
    return (
        <div style={{
            backgroundColor: "#fbfbff", height: "150px", width: "450px", border: "1px dashed #D3D3D3", borderRadius: "10px", borderSpacing: "10px", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <Button fullWidth style={{ height: "150px" }}>
                <div>
                    <CloudUploadOutlined style={{ color: "#696969", }} />
                    <Typography style={{ color: "#D3D3D3" }} display="block" variant='caption'>Upload a image for menu</Typography>
                </div>
            </Button>
        </div>
    )
}

