import { Button, IconButton, TextField, TextFieldProps, Typography } from '@mui/material'
import { FC, useEffect, useState } from 'react'
import InputField from '../../ui-components/Input'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { MyLocation } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup';
import { v4 as uuidv4 } from 'uuid';
import QRCode from 'qrcode'
import { getDoc, increment, serverTimestamp, updateDoc, writeBatch } from "firebase/firestore";
import { doc, setDoc } from "firebase/firestore";
import { db } from '../../../firebase';
import { useNavigate, useParams } from 'react-router-dom';
import { type } from 'os';
import { RootObject } from './shopsTable';


//Yup Validation
const schema = yup.object({
    shopName: yup.string().min(3).required("Shop name is required"),
    adminEmail: yup.string().email('Must be a valid email').max(255).required('Email is required'),
    address: yup.string().min(10).max(1000).required("Address is required"),
    area: yup.string().matches(/^[a-zA-Z0-9 ._-]+$/, { message: 'area cannot contain special characters' }).min(2).max(1000).required("Area is required"),
    city: yup.string().min(2).max(1000).required("City is required"),
    Latitude: yup.number().min(-90).max(90).required("Latitude is required"),
    Longitude: yup.number().min(-180).max(180).required("Longitude is required"),
    razorpayId: yup.string().length(23).required("Razorpay ID is required"),
    remark: yup.string().max(1000),
    premium: yup.number().min(1).required("Premium is required"),
    businessType: yup.string().required("Business Type is required"),
})

type AddShopProps = {
    editMode?: boolean
}

export const AddShop = ({ editMode }: AddShopProps) => {

    const params = useParams()
    const navigate = useNavigate()
    const [shopDetails, setShopDetails] = useState<any>(null)
    const [start, setStart] = useState<Date | null>(new Date())
    const [end, setEnd] = useState<Date | null>(new Date())
    const [onBoardDate, setOnBoardDate] = useState<Date | null>(new Date())
    const [dueDate, setDueDate] = useState<Date | null>(new Date())
    const { register, handleSubmit, setValue, watch, getValues, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    })

    const fetchShopDetails = async (id: string) => {
        const shopRef = doc(db, "admin", id);
        const docSnap = await getDoc(shopRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setShopDetails(docSnap.data())
            // if (!shopDetails) return
            setStart(docSnap.data()['startDate'].toDate())
            setEnd(docSnap.data()['endDate'].toDate())
            setOnBoardDate(docSnap.data()['onBoardDate'].toDate())
            setDueDate(docSnap.data()['dueDate'].toDate())
            Object.keys(docSnap.data()).forEach(key => {
                setValue(key, docSnap.data()[key])
            })

        } else {
            console.log("No such document!");
        }
    }


    useEffect(() => {
        if (editMode && params['id']) {
            fetchShopDetails(params['id'])
        }
    }, [])

    const getGeo = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        }
    }

    const showPosition = (position: any) => {
        setValue(
            "Latitude", position.coords.latitude
        )
        setValue(
            "Longitude", position.coords.longitude
        )
    }

    const onSubmit = async (data: any) => {

        try {
            const shopId = editMode ? shopDetails.shopId : data.shopName.replace(/ /g, "-") + '-' + data.area.replace(/ /g, "-") + '-' + uuidv4();
            if (editMode) {
                const batch = writeBatch(db);
                batch.update(doc(db, "admin", shopId), {
                    ...data,
                    startDate: start,
                    endDate: end,
                    onBoardDate,
                    dueDate,
                });
                batch.update(doc(db, "roles", shopId), {
                    adminEmail: data.adminEmail,
                });
                batch.update(doc(db, "shops", shopId), {
                    Latitude: data.Latitude,
                    Longitude: data.Longitude,
                    address: data.address,
                    adminEmail: data.adminEmail,
                    area: data.area,
                    city: data.city,
                    razorpayId: data.razorpayId,
                    shopName: data.shopName,
                    shopId: shopId
                });
                await batch.commit()
                navigate('/')
            } else {
                const batch = writeBatch(db);
                const qrImage = await QRCode.toDataURL(`https://restaurant.itsonmenu.com/restaurant/${shopId}`)
                batch.set(doc(db, "admin", shopId), {
                    ...data,
                    startDate: start,
                    endDate: end,
                    onBoardDate,
                    dueDate,
                    shopId,
                    registered: false,
                    created: serverTimestamp(),
                    role: "admin",
                    enabled: false,
                    qrImage,
                    url: `https://restaurant.itsonmenu.com/restaurant/${shopId}`,
                })
                batch.set(doc(db, "roles", shopId), {
                    adminEmail: data.adminEmail,
                    enabled: false,
                    registered: false,
                    role: "admin",
                    shopName: data.shopName,
                })
                batch.set(doc(db, "shops", shopId), {
                    Latitude: data.Latitude,
                    Longitude: data.Longitude,
                    address: data.address,
                    adminEmail: data.adminEmail,
                    area: data.area,
                    city: data.city,
                    enabled: false,
                    razorpayId: data.razorpayId,
                    registered: false,
                    shopName: data.shopName,
                    shopId: shopId
                })
                batch.update(doc(db, "metaData", "count"), {
                    shopsCount: increment(1)
                })
                await batch.commit()
                navigate('/')
                console.log("success");

            }

        } catch (error) {
            console.log(error);

        }
    }

    return (
        <div style={{ backgroundColor: "#F6F7FA", padding: "3vh" }}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <div style={{ width: "80vw", margin: "5vh auto", borderRadius: "20px", padding: "35px", boxShadow: "0px 4px 8px rgba(154, 207,255,0.15)", backgroundColor: "white" }}>
                    <Typography style={{ marginBottom: "20px" }} gutterBottom variant='h5'>Restaurant Info</Typography>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ display: "grid", gap: "15px" }}>
                            <InputField
                                placeholder="Shop Name"
                                fullWidth
                                forminput={{ ...register("shopName") }}
                                // defaultValue={shopDetails.shopName ?? ''}
                                error={Boolean(errors['shopName'])}
                                helperText={errors['shopName']?.message}
                                name="shopName"
                            />
                            <InputField type="email"
                                placeholder='Admin Email'
                                fullWidth
                                forminput={{ ...register("adminEmail") }}
                                // defaultValue={shopDetails.adminEmail ?? ''}
                                error={Boolean(errors['adminEmail'])}
                                helperText={errors['adminEmail']?.message}
                                name="adminEmail"
                            />
                            <InputField
                                multiline placeholder='Address'
                                fullWidth
                                forminput={{ ...register("address") }}
                                // defaultValue={shopDetails.address ?? ''}
                                error={Boolean(errors['address'])}
                                helperText={errors['address']?.message}
                                name="address"
                            />
                            <InputField
                                placeholder='Area'
                                fullWidth forminput={{ ...register("area") }}
                                // defaultValue={shopDetails.area ?? ''}
                                error={Boolean(errors['area'])}
                                helperText={errors['area']?.message}
                                name="area"
                            />
                            <InputField placeholder='City'
                                fullWidth
                                forminput={{ ...register("city") }}
                                // defaultValue={shopDetails.city ?? ''}
                                error={Boolean(errors['city'])}
                                helperText={errors['city']?.message}
                                name="city"
                            />
                            <label>Location</label>
                            <div style={{ display: "flex", gap: "20px" }}>
                                <InputField placeholder='Latitude'
                                    forminput={{ ...register("Latitude") }}
                                    // defaultValue={shopDetails.Latitude ?? ''}
                                    error={Boolean(errors['Latitude'])}
                                    helperText={errors['Latitude']?.message}
                                    name="Latitude"
                                />
                                <InputField placeholder='Longitude'
                                    forminput={{ ...register("Longitude") }}
                                    // defaultValue={shopDetails.Longitude ?? ''}
                                    error={Boolean(errors['Longitude'])}
                                    helperText={errors['Longitude']?.message}
                                    name="Longitude"
                                />
                                <IconButton><MyLocation onClick={getGeo} /></IconButton>
                            </div>

                            <label>Razorpay payment Key</label>
                            <InputField
                                placeholder='Razorpay API Key'
                                fullWidth
                                forminput={{ ...register("razorpayId") }}
                                // defaultValue={shopDetails.razorpayId ?? ''}
                                error={Boolean(errors['razorpayId'])}
                                helperText={errors['razorpayId']?.message}
                                name="razorpayId"
                            />

                            <label>Premium Paid</label>
                            <InputField placeholder='Premium'
                                fullWidth
                                forminput={{ ...register("premium") }}
                                // defaultValue={shopDetails.premium ?? ''}
                                error={Boolean(errors['premium'])}
                                helperText={errors['premium']?.message}
                                name="premium"
                            />

                            <div style={{ display: "flex", gap: "50px" }}>
                                <div>
                                    <label>Start Date</label>
                                    <div style={{ padding: "10px 0 10px" }}>
                                        <DesktopDatePicker
                                            label="Date desktop"
                                            inputFormat="MM/dd/yyyy"
                                            value={start}
                                            onChange={(newValue: Date | null) => setStart(newValue)}
                                            renderInput={(params: TextFieldProps) => <TextField {...params} />}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label>End Date</label>
                                    <div style={{ padding: "10px 0 10px" }}>
                                        <DesktopDatePicker
                                            label="Date desktop"
                                            inputFormat="MM/dd/yyyy"
                                            value={end}
                                            onChange={(newValue: Date | null) => setEnd(newValue)}
                                            renderInput={(params: TextFieldProps) => <TextField {...params} />}
                                        />
                                    </div>
                                </div>
                            </div>

                            <InputField placeholder='Remarks (Optional)'
                                fullWidth forminput={{ ...register("remarks") }}
                                // defaultValue={shopDetails.remarks ?? ''}
                                name="remarks"
                            />

                            <label>Buiness Type</label>
                            <InputField placeholder='Business Type (Hotel, Spa)'
                                fullWidth forminput={{ ...register("businessType") }}
                                // defaultValue={shopDetails.businessType ?? ''}
                                error={Boolean(errors['businessType'])}
                                helperText={errors['businessType']?.message}
                                name="businessType"
                            />

                            <label>Onboard Date</label>
                            <div style={{ padding: "10px 0 10px" }}>
                                <DesktopDatePicker
                                    label="Date desktop"
                                    inputFormat="MM/dd/yyyy"
                                    value={onBoardDate}
                                    onChange={(newValue: Date | null) => setOnBoardDate(newValue)}
                                    renderInput={(params: TextFieldProps) => <TextField {...params} />}
                                />
                            </div>

                            <label>Payment Due date</label>
                            <div style={{ padding: "10px 0 10px" }}>
                                <DesktopDatePicker
                                    label="Date desktop"
                                    inputFormat="MM/dd/yyyy"
                                    value={dueDate}
                                    onChange={(newValue: Date | null) => setDueDate(newValue)}
                                    renderInput={(params: TextFieldProps) => <TextField {...params} />}
                                />
                            </div>
                        </div>
                        <div style={{ display: "flex", gap: "50px", justifyContent: "center", margin: "20px 0px 0px" }}>
                            <Button variant='outlined' onClick={() => navigate(-1)}>Cancel</Button>
                            <Button type='submit' variant='contained'>Save</Button>
                        </div>
                    </form>
                </div >
            </LocalizationProvider >
        </div>
    )
}
