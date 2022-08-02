import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { collection, doc, getDocs, orderBy, query, updateDoc, where, writeBatch } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { db } from '../config/firebase';
import { RootState } from '../redux/store';
import { menuType } from '../redux/services';

type Props = {}

export const PublishedMenu = (props: Props) => {

    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const [allBranches, setAllBranches] = useState<any>([])
    const [allMenu, setAllMenu] = useState<any>([])
    const [clickedMenu, setClickedMenu] = useState<any>([]) //Selected branch menu

    //Accordin  
    const [expanded, setExpanded] = React.useState<string | false>(false);
    const handleChange =
        (branchName: string, branchId: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? branchName : false)
            getClickedMenu(branchId)
        };

    // Filtered menu according to branches
    const getClickedMenu = (branchId: string) => {
        setClickedMenu(allMenu.filter((fm: menuType) => fm.branchId === branchId
            // (fm.status === "created" || fm.status === "unpublished")
        ))
    }

    // get all the menu
    async function getMenus() {
        if ((selectedShop)) {
            const ref = collection(db, "shops", selectedShop.id, "menu")
            const q = query(ref, where("status", "==", "published"), orderBy("index"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
            if (result.length > 0) {
                setAllMenu(result)
            }
        }
    }

    // Get all the branches
    async function getBranches() {
        if (selectedShop) {
            const ref = collection(db, "shops", selectedShop.id, "branches")
            const q = query(ref, orderBy("index"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())
            setAllBranches(result)
        }
    }

    // Menu Status
    const changeMenuStatus = async (id: string) => {
        const filteredMenu = clickedMenu.filter((fm: menuType) => fm.id !== id)
        // const result = clickedMenu.find((m: menuType) => m.id === id)
        // result.status = "unpublished"
        if (selectedShop) {
            const ref = doc(db, "shops", selectedShop.id, "menu", id)
            await updateDoc(ref, {
                status: "unpublished"
            })
        }
        setClickedMenu(filteredMenu)
        // updateIndex(id)
    }

    // Update index
    // async function updateIndex(id: string) {
    //     try {
    //         const result = clickedMenu.filter((m: menuType) => m.id !== id)
    //         result.map((m: menuType) => {
    //             if (m.index >= 0)
    //                 m.index - 1
    //         })
    //         const batch = writeBatch(db)
    //         if (selectedShop) {
    //             result.forEach(async (m: any, index: number) => {
    //                 const branchesRef = doc(db, "shops", selectedShop.id, "menu", m.id);
    //                 batch.update(branchesRef, {
    //                     index: index
    //                 })
    //             })
    //             await batch.commit()
    //         }
    //     } catch (error) {
    //         console.log(error);

    //     }
    // }

    useEffect(() => {
        getBranches()
        getMenus()
    }, [])

    return (
        <div>
            {allBranches.map((b: any) => (
                <Accordion expanded={expanded === b.branchName} onChange={handleChange(b.branchName, b.id)}>
                    <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                    >
                        <Typography >{b.branchName}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        <Typography>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "10px" }}>
                                {clickedMenu.map((cm: menuType) =>

                                    // Menu cards
                                    <Card sx={{ maxWidth: 300 }}>
                                        <CardMedia
                                            component="img"
                                            height="100"
                                            image={cm.img}
                                            alt={cm.menuName}
                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="subtitle1" component="div">
                                                Name : {cm.menuName}
                                            </Typography>
                                            <Typography variant="subtitle2">
                                                Status : {cm.status}
                                                {/* {cm.timings.map((t) =>
                                                    <>
                                                        {t.day}
                                                        {t.from}
                                                        {t.to}
                                                    </>
                                                )} */}
                                            </Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small"
                                                onClick={async () => await changeMenuStatus(cm.id)}
                                            >
                                                Unpublish</Button>
                                        </CardActions>
                                    </Card>

                                )}
                            </div>
                        </Typography>
                    </AccordionDetails>
                </Accordion>

            ))}
        </div>
    )
}