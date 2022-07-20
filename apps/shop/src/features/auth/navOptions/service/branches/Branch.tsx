import { CloudUploadOutlined, MyLocation } from '@mui/icons-material'
import { Button, CircularProgress, IconButton, Typography } from '@mui/material'
import { Simplemodal } from '../../../../../components/modal'
import InputField from '../../../../../ui-components/Input'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import add from "../../../../../assets/add.svg"
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useDispatch, useSelector } from 'react-redux'
import { addBranch, branchesType, setBranch, setLoading, setSelectedBranches } from '../../../../../redux/services'
import { RootState } from '../../../../../redux/store'
import { v4 as uuidv4 } from 'uuid';
import { setError, setNotification } from '../../../../../redux/auth'
import { app, db } from '../../../../../config/firebase'
import { collection, doc, getDocs, orderBy, query, setDoc } from 'firebase/firestore'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { Droppable } from "react-beautiful-dnd";
import { Draggable } from "react-beautiful-dnd";
import { MiuracImage } from '@on-menu/miurac-image'
import { Login } from '../../../login'


const style = { display: "flex", alignItems: "center", gap: "25px" }

type Inputs = {
    branchName: string
    Latitude: string
    Longitude: string
    address: string
    city: string
    branchImage: string
}

//Yup Validation
const schema = yup.object({
    branchName: yup.string().min(3).required("Branch name is required"),
    address: yup.string().min(10).max(1000).required("Address is required"),
    city: yup.string().min(2).max(1000).required("City is required"),
    Latitude: yup.string().min(-90).max(90).required("Latitude is required").typeError('must be a number'),
    Longitude: yup.string().min(-180).max(180).required("Longitude is required").typeError('must be a number'),
})

export const Branch = ({ localBranches, setLocalBranches }: { localBranches: branchesType[], setLocalBranches: any }) => {
    const [modal, setModal] = useState(false)
    const [locationColor, setLocationColor] = useState(false)
    const [branchImage, setBranchImage] = useState<string | null>(null)
    const { register, handleSubmit, setValue, setError, clearErrors, formState: { errors } } = useForm<Inputs>({
        resolver: yupResolver(schema)
    });
    const { branches, status, loading, selectedBranch } = useSelector((state: RootState) => state.branches)
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { shopid, branchid } = useParams()

    const getBranches = async () => {
        try {
            if (!shopid) return
            const ref = collection(db, "shops", shopid, "branches")
            const q = query(ref, orderBy("index", "asc"))
            const querySnapshot = await getDocs(q)
            const data = querySnapshot.docs.map(doc => doc.data())
            const branch = data.find((branch, index) => branch['id'] === branchid)
            dispatch(setBranch(data))
            if (!branchid) {
                navigate(`/${shopid}/${data[0]['id']}`)
            } else {
                if (!branch) return
                dispatch(setSelectedBranches(branch))
                navigate(`/${shopid}/${branch['id']}`)
            }
        } catch (error: any) {
            // dispatch(setError(error.message))
        }
    }

    useEffect(() => {
        if (status === "loading") {
            getBranches()
        }
    }, [])

    useEffect(() => {
        if (status === 'idle') {
            setLocalBranches(branches)
        }
    }, [branches])


    const onsubmit = async (data: Inputs) => {
        if (!branchImage) {
            setError('branchImage', { message: "Image is required", type: 'required' })
            return
        } else {
            clearErrors('branchImage')
        }
        try {
            dispatch(setLoading(true))
            const id = `${data.branchName.replace(" ", "-")}-${uuidv4()}`
            const branchInfo = {
                ...data,
                id: id,
                enabled: false,
                branchImage,
                index: branches?.length
            }
            if (!shopid) return
            await setDoc(doc(db, "shops", shopid, "branches", id), branchInfo)
            dispatch(addBranch(branchInfo))
            setModal(false)
            dispatch(setNotification("Branch added successfully"))
            dispatch(setLoading(false))
        } catch (error: any) {
            // @ts-ignore: Unreachable code error
            dispatch(setError(error.message))
        }

        handleClose()
    }

    const getGeo = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }

    const showPosition = (position: any) => {
        setLocationColor(true)
        setValue(
            "Latitude", position.coords.latitude
        )
        setValue(
            "Longitude", position.coords.longitude
        )
    }

    const handleClose = () => {
        setModal(false)
        setBranchImage(null)
        setValue("branchName", "")
        setValue("Latitude", "")
        setValue("Longitude", "")
        setValue("address", "")
        setValue("city", "")
        clearErrors('branchImage')
    }

    if (status === "loading") return <CircularProgress />

    return (
        <div className='box' style={{ height: "60px", display: "flex", alignItems: 'center' }}>
            <Simplemodal open={modal} onClose={handleClose}>
                <Typography style={{ marginBottom: "30px" }} variant='h5'>Add branch info</Typography>
                <form onSubmit={handleSubmit(onsubmit)}>
                    <div style={{ display: "grid", gridTemplate: "repeat(4,1fr)/1fr 3fr", alignItems: "center", justifyItems: "left", gap: "15px" }}>
                        <div><label>Branch Name:</label></div>
                        <div>
                            <InputField
                                placeholder='Branch Name'
                                fullWidth forminput={{ ...register("branchName") }}
                                error={Boolean(errors.branchName)}
                                helperText={errors.branchName?.message}
                            />
                        </div>
                        <div><label>Location:</label></div>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <InputField placeholder='Latitude' forminput={{ ...register("Latitude") }} error={Boolean(errors.Latitude)}
                                helperText={errors.Latitude?.message} />
                            <InputField placeholder='Longitude' forminput={{ ...register("Longitude") }} error={Boolean(errors.Longitude)}
                                helperText={errors.Longitude?.message} />
                            <IconButton onClick={getGeo}><MyLocation color={locationColor ? "primary" : "inherit"} /></IconButton>
                        </div>
                        <div><label>Address:</label></div>
                        <div>
                            <InputField placeholder='Address' fullWidth forminput={{ ...register("address") }} error={Boolean(errors.address)}
                                helperText={errors.address?.message} />
                        </div>

                        <div><label>City:</label></div>
                        <div>
                            <InputField placeholder='City' fullWidth forminput={{ ...register("city") }} error={Boolean(errors.city)}
                                helperText={errors.city?.message} />
                        </div>

                        <div><label>Branch image :</label></div>
                        {branchImage ?
                            <img width="450px" height="150px" src={branchImage} alt="menu" /> :
                            <div>
                                <MiuracImage app={app} authComponent={<Login />} buttonComponent={<Upload />}
                                    editConfig={{ aspectX: 3, aspectY: 1 }} updateFirestore={true}
                                    setUrlFunc={(url) => setBranchImage(url)}
                                />
                                <Typography color={'error'} >
                                    {errors['branchImage']?.message}
                                </Typography>
                            </div>
                        }

                    </div >

                    <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "30px" }}>
                        <Button size='small' onClick={() => setModal(false)} variant='outlined'>Cancel</Button>
                        <Button disabled={loading} size='small' type='submit' variant='contained'>save</Button>
                    </div>

                </form>
            </Simplemodal >

            <div style={{ display: "flex", gap: "10px" }}>
                <Typography variant='subtitle1'>Branches</Typography>
            </div>

            <Droppable droppableId="BranchesList" direction="horizontal">
                {(provided, snapshot) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: "flex", gap: "20px", marginLeft: "25px" }}>
                        {localBranches?.map((branch: branchesType) => {
                            return (
                                <Draggable key={branch.id} draggableId={branch.id} index={branch.index}>
                                    {(provided, snapshot) => (
                                        <div
                                            ref={provided.innerRef}
                                            className={selectedBranch?.id === branch.id ? 'selected-branch' : 'branch'}
                                            onClick={() => { dispatch(setSelectedBranches(branch)); navigate(`/${shopid}/${branch.id}`) }}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                        >
                                            {branch.branchName}
                                        </div>
                                    )
                                    }
                                </Draggable>
                            )
                        })}
                        {provided.placeholder}
                        <img onClick={() => setModal(true)} className='add' src={add} alt="add" />
                    </div>
                )
                }
            </Droppable >
        </div >
    )
}

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
