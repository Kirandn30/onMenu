import { Button, Typography } from '@mui/material'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../configs/firebaseConfig'
import { serviceType, setSelectedBranch, setSelectedService, setServices } from '../redux/appSlice'
import { RootState } from '../redux/store/store'
import { BottomNav } from './bottomNav'
import { ServiceCardPopUp } from './serviceCardPopUp'


export const ServicesComponent = () => {

    // Styling...
    const serviceCardStyles: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "1fr 2fr",
        maxWidth: 345,
        margin: "auto",
        marginBottom: "10px",
        gap: "5px",
        alignItems: "center",
        boxShadow: "0px 4px 6px rgba(163, 205, 255, 0.2)",
        borderRadius: "10px",
        padding: "0px 5px",
        position: "relative",
        cursor: 'pointer'
    }

    const imageStyles: React.CSSProperties = {
        width: "111px",
        height: "112px",
        objectFit: "cover",
        borderRadius: "15px"
    }

    const buttonStyles: React.CSSProperties = {
        position: "absolute",
        bottom: "10px",
        right: "10px",
    }

    const more = (
        <b> . . . </b>
    )

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { shopId, branchId, menuId } = useParams()
    const { services, selectedBranch } = useSelector((state: RootState) => state.appSlice)
    const [viewDetails, setViewDetails] = useState(false)

    // changes
    const [popUpService, setPopUpService] = useState<serviceType | null>(null)

    async function getServices() {
        if (shopId && menuId && branchId) {
            const ref = collection(db, "shops", shopId, "services")
            const q = query(ref, where("menuId", "==", menuId), where("status", "==", "published"), orderBy("index"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
            dispatch(setServices(result))

            //For the branch name
            if (!selectedBranch) {
                const ref = doc(db, "shops", shopId, "branches", branchId)
                const docSnap = await getDoc(ref);
                if (docSnap.exists()) {
                    dispatch(setSelectedBranch(docSnap.data()))
                } else {
                    console.log("No such document!");
                }
            }
        }
    }

    useEffect(() => {
        if ((menuId || branchId) === "undefined") {
            navigate(`/${shopId}/${branchId}`)
        } else {
            getServices()
        }
    }, [shopId, menuId, branchId])

    const handleClick = (service: serviceType) => {
        dispatch(setSelectedService(service)) // For Cart
        setPopUpService(service)
        setViewDetails(true)
    }

    return (
        <div>

            {services.map((s: serviceType) => (
                <div onClick={() => handleClick(s)} key={s.id} style={serviceCardStyles}>

                    <div style={{ gridColumn: "1/2" }}>
                        <img style={imageStyles} src={s.serviceImage} />
                    </div>

                    <div>
                        <Typography variant='h6'>{s.serviceName}</Typography>
                        <div style={{ height: "50px", overflow: "hidden" }}>
                            <Typography variant='caption'>{s.description.substring(0, 50)}{more}</Typography>
                        </div>
                        <p>{s.price}</p>
                    </div>

                    <Button sx={buttonStyles} size='medium' variant="contained">Book</Button>

                </div>
            ))}

            <BottomNav />

            {/* <ServiceCardPopUp 
            onClose={()=>setPopUpService(null)}
            // setViewDetails={setViewDetails} 
            viewDetails={Boolean(popUpService)} 
            popUpService={popUpService} 
            /> */}

            <ServiceCardPopUp setViewDetails={setViewDetails} viewDetails={viewDetails} popUpService={popUpService} />

        </div>
    )
}