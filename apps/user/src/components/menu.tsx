import { Card, CardActionArea, CardContent, CardMedia, Typography } from '@mui/material'
import { collection, doc, getDoc, getDocs, orderBy, query, where } from 'firebase/firestore'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../configs/firebaseConfig'
import { menuType, setMenu, setSelectedBranch, setSelectedMenu } from '../redux/appSlice'
import { RootState } from '../redux/store/store'

export const MenuComponent = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { shopId, branchId } = useParams()
    const { menu, selectedBranch } = useSelector((state: RootState) => state.appSlice)

    async function getMenu() {
        if (shopId && branchId) {
            const ref = collection(db, "shops", shopId, "menu")
            const q = query(ref, where("branchId", "==", branchId), where("status", "==", "published"), orderBy("index"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
            dispatch(setMenu(result))

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
        if (branchId === "undefined") {
            navigate(`/${shopId}`)
        } else {
            getMenu()
        }
    }, [shopId, branchId])

    const handleCardClick = (m: menuType) => {
        dispatch(setSelectedMenu(m))
        navigate(`/${shopId}/${selectedBranch?.id}/${m.id}`)
    }

    const menuStyles: React.CSSProperties = {
        maxWidth: 345,
        margin: "auto",
        marginBottom: "10px"
    }

    return (
        <div>
            {menu.map((m: menuType) => (
                <Card key={m.id} sx={menuStyles} onClick={() => handleCardClick(m)}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            height="140"
                            image={m.img}
                            alt={m.menuName + " image"}
                        />
                        <CardContent>
                            <Typography textAlign={"center"} variant="h5">
                                {m.menuName}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}
        </div>
    )
}