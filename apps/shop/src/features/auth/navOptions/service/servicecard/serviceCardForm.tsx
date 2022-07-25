import { CloudUploadOutlined } from '@mui/icons-material'
import add from "../../../../../assets/add.svg"
import { Button, InputAdornment, Typography } from '@mui/material'
import { MiuracImage } from '@on-menu/miurac-image'
import { app, db } from 'apps/shop/src/config/firebase'
import InputField from 'apps/shop/src/ui-components/Input'
import { useEffect, useState } from 'react'
import { Login } from '../../../login'
import _ from "lodash"
import Options from './options/options'
import { RecommendedServices } from './recommended/recommendedServices'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, updateDoc } from 'firebase/firestore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'apps/shop/src/redux/store'
import { Simplemodal } from 'apps/shop/src/components/modal'
import { serviceType, setServices } from 'apps/shop/src/redux/services'

const schema = yup.object({
    serviceName: yup.string().min(4, "Minimum 4 characters is required").required(),
    description: yup.string().required(),
    estimatedTime: yup.number().required("Time is required"),
    price: yup.number().required("Please enter the price")
})

type ServiceCardForm = {
    editMode: Boolean
    setEditMode: React.Dispatch<React.SetStateAction<boolean>>
    serviceToBeEdited: serviceType | null
}

export const ServiceCardForm = ({ editMode, setEditMode, serviceToBeEdited }: ServiceCardForm) => {

    const fieldStyles = {
        display: "flex",
        justifyContent: "center",
        width: "100%"
    }

    const dispatch = useDispatch()
    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const { services, selectedMenu } = useSelector((state: RootState) => state.branches)
    const [serviceCardImage, setServiceCardImage] = useState<string | null>(null)
    const [options, setOptions] = useState<Array<any>>([])
    const [showServiceCardFrom, setShowServiceCardFrom] = useState(false)
    const [recommended, setRecommended] = useState<Array<any>>([])
    const { register, handleSubmit, setValue, clearErrors, formState: { errors }, setError } = useForm({ resolver: yupResolver(schema) });

    useEffect(() => {
        if (editMode) {
            setShowServiceCardFrom(true)
            if (serviceToBeEdited) {
                setValue("serviceName", serviceToBeEdited.serviceName)
                setValue("description", serviceToBeEdited.description)
                setValue("estimatedTime", serviceToBeEdited.estimatedTime)
                setServiceCardImage(serviceToBeEdited.serviceImage)
                setOptions(serviceToBeEdited.options)
                setRecommended(serviceToBeEdited.recommended)
            }
        }
    }, [editMode])

    const onsubmit = async (data: any) => {
        // validatation 
        if (!serviceCardImage) {
            setError('serviceCardImage', { message: "Menu image is required", type: 'required' })
            return;
        } else {
            clearErrors('serviceCardImage')
        }

        // Create Service 
        if (!editMode) {
            try {
                const id = `${data.serviceName.replace(" ", "-")}-${uuidv4()}`
                const targetData = {
                    ...data,
                    id,
                    branchId: selectedMenu?.branchId,
                    menuId: selectedMenu?.id,
                    serviceImage: serviceCardImage,
                    options: options,
                    recommended: recommended,
                    index: services.filter((fs)=> fs.menuId === selectedMenu?.id).length
                }

                if (selectedShop) {
                    const ref = doc(db, `shops/${selectedShop.id}/services`, id)
                    await setDoc(ref, targetData)
                    dispatch(setServices([...services, targetData]))
                }
            } catch (error) {
                console.log(error);
            }
        } else {
            // Update service
            try {
                const targetData = {
                    ...data,
                    serviceImage: serviceCardImage,
                    options,
                    recommended
                }
                if (selectedShop && serviceToBeEdited) {
                    const ref = doc(db, `shops/${selectedShop.id}/services`, serviceToBeEdited?.id)
                    await updateDoc(ref, targetData)
                }
            } catch (error) {
                console.log(error);
            }
        }
        handleClose()
    }

    //Form Modal close
    const handleClose = () => {
        setShowServiceCardFrom(false)
        setEditMode(false)
        setValue("serviceName", "")
        setValue("description", "")
        setValue("estimatedTime", "")
        setServiceCardImage(null)
        setOptions([])
        setRecommended([])
        clearErrors('serviceCardImage')
    }

    return (
        <div>
            <div style={{ display: "grid", gridTemplateColumns: "11fr 1fr", alignItems: "center" }}>
                <Typography align='center' variant='h6'> Service card</Typography>
                {selectedMenu && <img className='add' onClick={() => setShowServiceCardFrom(true)} src={add} alt="add" />}
            </div>

            {/* From Modal */}
            <Simplemodal style={{ height: "55vh" }} onClose={handleClose} open={showServiceCardFrom}>
                <form onSubmit={handleSubmit(onsubmit)}>

                    <div style={{
                        display: "grid", gridTemplateColumns: "1fr",
                        marginTop: "30px", alignItems: "center", gap: "25px", justifyItems: "center"
                    }}>

                        <div style={fieldStyles}>
                            <label style={{ width: "40%", textAlign: "left", paddingLeft: "10px" }}>Service Card Name: </label>
                            <InputField style={{ width: "60%" }} placeholder='Service Name' fullWidth
                                forminput={{ ...register("serviceName") }}
                                helperText={errors['serviceName']?.message}
                                error={Boolean(errors['serviceName'])}
                            />
                        </div>

                        <div style={fieldStyles}>
                            <label style={{ width: "40%", textAlign: "left", paddingLeft: "10px" }}>Description: </label>
                            <InputField style={{ width: "60%" }} multiline rows={4} placeholder='Description' fullWidth
                                forminput={{ ...register("description") }}
                                helperText={errors['description']?.message}
                                error={Boolean(errors['description'])}
                            />
                        </div>

                        <div style={fieldStyles}>
                            <label style={{ width: "40%", textAlign: "left", paddingLeft: "10px" }}>Upload Image: </label>
                            <div style={{ width: "60%", }}>
                                {serviceCardImage ? (
                                    <img width="450px" height="150px" src={serviceCardImage} alt="menu" />
                                ) : (
                                    <MiuracImage app={app} authComponent={<Login />} buttonComponent={<Upload />}
                                        updateFirestore={true} editConfig={{ aspectX: 3, aspectY: 1 }}
                                        setUrlFunc={(url) => setServiceCardImage(url)} />
                                )}
                                <Typography color={'error'} >
                                    {errors['serviceCardImage']?.message}
                                </Typography>
                            </div>
                        </div>

                        <div style={fieldStyles}>
                            <label style={{ width: "40%", textAlign: "left", paddingLeft: "10px" }}>Estimated Time: </label>
                            <InputField type={"number"} style={{ width: "60%" }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="end">
                                        <span style={{ color: "black" }}>Mins</span>
                                    </InputAdornment>
                                }}
                                forminput={{ ...register("estimatedTime") }}
                                helperText={errors['estimatedTime']?.message}
                                error={Boolean(errors['estimatedTime'])}
                            />
                        </div>

                        <div style={fieldStyles}>
                            <label style={{ width: "40%", textAlign: "left", paddingLeft: "10px" }}>Price: </label>
                            <InputField type={"number"} style={{ width: "60%" }} placeholder='Price' fullWidth
                                forminput={{ ...register("price") }}
                                helperText={errors['price']?.message}
                                error={Boolean(errors['price'])}
                            />
                        </div>

                        {/* Options Component */}
                        <div style={{ width: "100%", textAlign: "left", paddingLeft: "10px" }}>
                            <label style={{ width: "100%" }}>Options: </label>
                            <Options options={options} setOptions={setOptions} />
                        </div>

                        {/* Recommended Services Component */}
                        <div style={{ width: "100%", textAlign: "left", paddingLeft: "10px" }}>
                            <label style={{ width: "100%" }}>Recommended Services: </label>
                            <RecommendedServices recommended={recommended} setRecommended={setRecommended} />
                        </div>

                        <div>
                            <Button sx={{ margin: "0px 15px" }} variant='contained' type='submit'>
                                Save
                            </Button>
                            <Button sx={{ margin: "0px 15px" }} variant='outlined'
                                onClick={handleClose}>
                                Cancel
                            </Button>
                        </div>
                    </div>
                </form>
            </Simplemodal>

        </div>
    )
}

const Upload = () => {
    return (
        <div style={{
            backgroundColor: "#fbfbff", height: "150px",
            border: "1px dashed #D3D3D3", borderRadius: "10px",
            borderSpacing: "10px", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <Button fullWidth style={{ height: "150px" }}>
                <div>
                    <CloudUploadOutlined style={{ color: "#696969", }} />
                    <Typography style={{ color: "#D3D3D3" }} display="block" variant='caption'>
                        Upload an image for Service Card
                    </Typography>
                </div>
            </Button>
        </div>
    )
}
