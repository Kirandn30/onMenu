import { useEffect, useState } from 'react'
import { useTransition, animated } from "react-spring"
import { collection, doc, getDocs, orderBy, query, where, writeBatch } from 'firebase/firestore'
import { db } from 'apps/shop/src/config/firebase'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'apps/shop/src/redux/store'
import { MenuForm } from './menuForm'
import { menuType, setMenu, setSelectedMenu } from 'apps/shop/src/redux/services'
import Menu from './menu';
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import _ from "lodash"
import { setselectedShop } from 'apps/shop/src/redux/shops'

export const MenuItems = () => {

    const transition = useTransition("a", {
        from: { x: 0, y: 100, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { menuId } = useParams()
    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const { menu, selectedBranch } = useSelector((state: RootState) => state.branches)
    const [editMode, setEditMode] = useState(false)
    const [menuToBeEdited, setMenuToBeEdited] = useState<menuType | null>(null)
    const [orderChanged, setOrderChanged] = useState<boolean>(false)
    const [filteredMenu, setFilteredMenu] = useState<Array<menuType>>([])


    async function getMenu() {
        if (selectedShop && selectedBranch) {
            const ref = collection(db, "shops", selectedShop.id, "menu")
            const q = query(ref, where("branchId", "==", selectedBranch.id), orderBy("index"));
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())

            if (result.length > 0) {
                dispatch(setMenu(result)) // all the menu
            }
        }
    }

    async function updateIndex() {
        try {
            const batch = writeBatch(db)
            if (selectedShop) {
                menu.forEach(async m => {
                    const branchesRef = doc(db, "shops", selectedShop.id, "menu", m.id);
                    batch.update(branchesRef, {
                        index: m.index
                    })
                })
                await batch.commit()
            }
        } catch (error) {
            console.log(error);

        }
    }

    //To filter menu
    useEffect(() => {
        if (selectedShop && selectedBranch) {
            const filtered = menu.filter((fm) => fm.branchId == selectedBranch.id)
            if (filtered.length > 0) {
                const defaultMenu = menuId ? filtered.find((m, index) => m['id'] === menuId) : filtered[0]
                if (!defaultMenu) {
                    dispatch(setSelectedMenu(filtered[0]))
                    navigate(`/${selectedShop.id}/${selectedBranch.id}/${filtered[0]['id']}`)
                } else {
                    dispatch(setSelectedMenu(defaultMenu))
                    navigate(`/${selectedShop.id}/${selectedBranch.id}/${defaultMenu['id']}`)
                }
            } else {
                dispatch(setSelectedMenu(null))
                navigate(`/${selectedShop.id}/${selectedBranch.id}`)
            }
            setFilteredMenu(filtered)
        }
    }, [menu, selectedBranch])

    useEffect(() => {
        getMenu()
    }, [editMode, selectedBranch, selectedShop])

    const menuClicked = (m: menuType) => {
        dispatch(setSelectedMenu(m))
        // navigate(`/${selectedShop?.id}/${selectedBranch?.id}/${selectedMenu?.id}`)
    }

    // Drag and Drop Function
    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result
        if (!destination) return
        if (destination.index === source.index) return

        const finalResult = Array.from(filteredMenu)  // we are copying the branches to a new variable for manipulation.
        const [removed] = finalResult.splice(source.index, 1)
        finalResult.splice(destination.index, 0, removed)
        const newData = finalResult.map((fs, index) => ({ ...fs, index }))
        setFilteredMenu(newData)
        setOrderChanged(true)
        dispatch(setMenu({ ...menu, newData }))
    }

    return (
        <>
            <div>
                {transition((style: any) =>
                    <animated.div style={style}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <>
                                <MenuForm editMode={editMode} setEditMode={setEditMode} menuToBeEdited={menuToBeEdited} /> {/* Also contains top title */}

                                <Droppable droppableId="menuList" >
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>

                                            {filteredMenu.map(m => (

                                                <Draggable key={m.id} draggableId={m.id} index={m.index}>
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            {/* Service card */}
                                                            <div onClick={() => { menuClicked(m) }} >
                                                                <Menu key={m.id} m={m} setEditMode={setEditMode} setMenuToBeEdited={setMenuToBeEdited} />
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>

                                            ))}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </>

                        </DragDropContext>
                    </animated.div>
                )}
            </div>

            {/* Save Order Button */}
            {orderChanged && <div style={{ position: "absolute", left: "40%" }}>
                {transition((style, item) =>
                    item && <animated.div style={{
                        ...style, textAlign: "center", width: "20vw", margin: "auto",
                        boxShadow: "0px 9px 9px rgba(229, 229, 229, 0.3)", backgroundColor: "white", padding: "15px",
                        borderRadius: "0px 0px 10px 10px"
                    }}>
                        Save changes
                        <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "10px" }}>
                            <Button onClick={() => setOrderChanged(false)} variant="outlined" size="small">cancel</Button>
                            <Button onClick={() => { setOrderChanged(false); updateIndex() }} variant="contained" size="small">save</Button>
                        </div>
                    </animated.div>
                )}
            </div>}

        </>
    )
}
