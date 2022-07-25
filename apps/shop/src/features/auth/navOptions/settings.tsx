import { yupResolver } from '@hookform/resolvers/yup'
import { CloudUploadOutlined } from '@mui/icons-material'
import { Button, Checkbox, Typography } from '@mui/material'
import { TimePicker } from '@mui/x-date-pickers'
import { MiuracImage } from '@on-menu/miurac-image'
import { app, db } from 'apps/shop/src/config/firebase'
import { setSelectedBranches, setSelectedMenu, setSelectedService } from 'apps/shop/src/redux/services'
import { setselectedShop, shopstype } from 'apps/shop/src/redux/shops'
import { RootState } from 'apps/shop/src/redux/store'
import InputField from 'apps/shop/src/ui-components/Input'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import * as yup from 'yup'
import { Login } from '../login'
import _ from "lodash"
import { v4 as uuidv4 } from 'uuid';

const schema = yup.object({
    shopName: yup.string().min(4, "Minimum 4 characters is required").required("Shop name is required"),
    fssaiNumber: yup.string().required(),
    address: yup.string().required(),
    area: yup.string().required(),
    city: yup.string().required(),
    Latitude: yup.string().required(),
    Longitude: yup.string().required(),
    razorpayId: yup.string().required(),
    serviceCharge: yup.number().required(),
    mobileNumber: yup.number().required(),
    whatsappNumber: yup.number().required(),
    adminEmail: yup.string().required(),

})

export const Settings = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { register, handleSubmit, setValue, clearErrors, formState: { errors }, setError } = useForm({ resolver: yupResolver(schema) })
    const [logo, setLogo] = useState<string | null>(null)
    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const [selectedTiming, setSelectedTiming] = useState<any>([])
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

    console.log(selectedTiming);


    const onsubmit = async (data: any) => {

        try {
            let targetData = {
                ...data,
                logo,
                timings: selectedTiming,
            }

            // if (data.shopName !== selectedShop?.shopName) {
            //     const id = `${data.shopName.replace(" ", "-")}-${uuidv4()}`
            //     targetData = {...targetData, id}
            // }

            if (selectedShop) {
                const ref = doc(db, `shops/${selectedShop.id}`)
                await updateDoc(ref, targetData);
                dispatch(setselectedShop(targetData))
            }
        } catch (error) {
            console.log(error)
        }

        // clearValues()
    }

    async function getShop() {
        if (selectedShop) {

            const docRef = doc(db, "shops", selectedShop.id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                const result = docSnap.data()
                setValue("shopName", result["shopName"])
                setValue("fssaiNumber", result["fssaiNumber"])
                setValue("address", result["address"])
                setValue("area", result["area"])
                setValue("city", result["city"])
                setValue("Latitude", result["Latitude"])
                setValue("Longitude", result["Longitude"])
                setValue("razorpayId", result["razorpayId"])
                setValue("serviceCharge", result["serviceCharge"])
                setValue("mobileNumber", result["mobileNumber"])
                setValue("whatsappNumber", result["whatsappNumber"])
                setValue("adminEmail", result["adminEmail"])
                setLogo(result["logo"])
                if (result["timings"]) {
                    const timings = result["timings"].map(({ day, from, to }: { day: any, from: any, to: any }) => (
                        { day, from: from.toDate(), to: to.toDate() }
                    ))
                    setSelectedTiming(timings)
                }
            } else {
                console.log("No such document!");
            }
        }
    }

    function clearValues() {
        setValue("shopName", "")
        setValue("fssaiNumber", "")
        setValue("address", "")
        setValue("area", "")
        setValue("city", "")
        setValue("Latitude", "")
        setValue("Longitude", "")
        setValue("razorpayId", "")
        setValue("serviceCharge", "")
        setValue("mobileNumber", "")
        setValue("whatsappNumber", "")
        setValue("adminEmail", "")
        setLogo(null)
    }

    const switchShop = () => {
        dispatch(setselectedShop(null),)
        dispatch(setSelectedBranches(null))
        dispatch(setSelectedMenu(null))
        dispatch(setSelectedService(null))
        navigate("/")
    }

    useEffect(() => {
        getShop()
    }, [selectedShop])

    return (
        <div>
            <form onSubmit={handleSubmit(onsubmit)}>

                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <div>
                        <div >
                            <label>Logo: </label>
                            {logo ? (
                                <img width="400px" height="100px" src={logo} alt="menu" />
                            ) : (
                                <MiuracImage app={app} authComponent={<Login />} buttonComponent={<Upload />}
                                    updateFirestore={true} editConfig={{ aspectX: 3, aspectY: 1 }}
                                    setUrlFunc={(url) => setLogo(url)} />
                            )}
                            <div>
                                {/* <Typography color={'error'} >
                            {errors['menuImage']?.message}
                        </Typography> */}
                            </div>
                        </div>

                        <div>
                            <label>Shopname: </label>
                            <InputField placeholder='Shop Name'
                                forminput={{ ...register("shopName") }}
                            // helperText={errors['menuName']?.message}
                            // error={Boolean(errors['menuName'])}
                            />
                        </div>

                        <div>
                            <label>FSSAI Number: </label>
                            <InputField placeholder='FSSAI Number'
                                forminput={{ ...register("fssaiNumber") }}
                            />
                        </div>

                        <div>
                            <label>Address: </label>
                            <InputField multiline rows={3} placeholder='Address'
                                forminput={{ ...register("address") }}
                            />
                        </div>

                        <div>
                            <label>Area: </label>
                            <InputField placeholder='Area'
                                forminput={{ ...register("area") }}
                            />
                        </div>

                        <div>
                            <label>City: </label>
                            <InputField placeholder='City'
                                forminput={{ ...register("city") }}
                            />
                        </div>

                        <div>
                            <label>Latitude: </label>
                            <InputField placeholder='Latitude'
                                forminput={{ ...register("Latitude") }}
                            />
                        </div>

                        <div>
                            <label>Longitude: </label>
                            <InputField placeholder='Longitude'
                                forminput={{ ...register("Longitude") }}
                            />
                        </div>

                        <div>
                            <label>Razorpay Id: </label>
                            <InputField placeholder='Razorpay Id'
                                forminput={{ ...register("razorpayId") }}
                            />
                        </div>

                        <div>
                            <label>Service Charge: </label>
                            <InputField type={"number"} placeholder='Service Charge'
                                forminput={{ ...register("serviceCharge") }}
                            />
                        </div>

                        <div>
                            <label>Mobile Number: </label>
                            <InputField placeholder='MobileNumber'
                                forminput={{ ...register("mobileNumber") }}
                            />
                        </div>

                        <div>
                            <label>Whatsapp Number:</label>
                            <InputField placeholder='Whatsapp Number'
                                forminput={{ ...register("whatsappNumber") }}
                            />
                        </div>

                        <div>
                            <label>Admin Email: </label>
                            <InputField placeholder='Admin Email'
                                forminput={{ ...register("adminEmail") }}
                            />
                        </div>
                    </div>

                    <div>
                        {days.map((day) => (
                            <React.Fragment key={day} >
                                <div>
                                    <Checkbox sx={{ color: "black" }}
                                        checked={Boolean(_.find(selectedTiming, { day }))}
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
                    </div>
                </div>

                <Button variant='contained' type='submit'>Save</Button>
            </form >

            <Button variant='contained' onClick={switchShop}>Switch Shop</Button>


        </div>
    )
}

// Image upload botton
const Upload = () => {
    return (
        <div style={{
            backgroundColor: "#fbfbff", height: "100px", width: "400px", border: "1px dashed #D3D3D3", borderRadius: "10px", borderSpacing: "10px", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <Button fullWidth style={{ height: "100px" }}>
                <div>
                    <CloudUploadOutlined style={{ color: "#696969", }} />
                    <Typography style={{ color: "#D3D3D3" }} display="block" variant='caption'>Upload a image </Typography>
                </div>
            </Button>
        </div>
    )
}

