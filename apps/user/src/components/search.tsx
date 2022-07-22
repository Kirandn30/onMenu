import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { db } from '../configs/firebaseConfig'
import InputField from '../input-field/input-field'
import { serviceType, setSelectedBranch, setSelectedService, setServices } from '../redux/appSlice'
import { RootState } from '../redux/store/store'
import { BottomNav } from './bottomNav'
import { ServiceCardPopUp } from './serviceCardPopUp'

type Props = {}

export const Search = (props: Props) => {

    const dispatch = useDispatch()
    // const { menuId } = useParams()
    const { shopId, branchId, menuId } = useParams()
    const { services, selectedBranch } = useSelector((state: RootState) => state.appSlice)
    // const { services } = useSelector((state: RootState) => state.appSlice)
    const [searchResults, setSearchResults] = useState<Array<serviceType>>([])
    const [viewDetails, setViewDetails] = useState(false)
    

    const searchService = (name: string) => {
        const filtered = services.filter(fs => fs.menuId === menuId)
        const result = filtered.filter(r =>
            r.serviceName.toLowerCase().search(name.toLowerCase()) >= 0)
        setSearchResults(result)
    }

    const handleClick = (service: serviceType) => {
        dispatch(setSelectedService(service))
        setViewDetails(true)
    }

    async function getServices() {
        if (shopId && menuId && branchId) {
            const ref = collection(db, "shops", shopId, "services")
            const q = query(ref, where("menuId", "==", menuId), orderBy("index"));
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
        getServices()
    }, [shopId, menuId, branchId])

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

    return (
        <div>
            <Typography variant='h6'>Search Services</Typography>

            <InputField placeholder='Service name'
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => searchService(e.target.value)}
            />

            {searchResults.map((result: serviceType) => (
                <Card key={result.id} sx={{ ...serviceCardStyles, maxWidth: "100%" }} onClick={() => handleClick(result)} >
                    <CardMedia
                        component="img"
                        height="140"
                        image={result.serviceImage}
                        alt={result.serviceName}
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {result.serviceName}
                        </Typography>
                        <Typography variant="body2">
                            {result.description}
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button size="small" variant='contained'>Add</Button>
                    </CardActions>
                </Card>
            ))}

            <BottomNav />

            <ServiceCardPopUp setViewDetails={setViewDetails} viewDetails={viewDetails} />

        </div>
    )
}