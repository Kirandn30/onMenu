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

export const MenuItems = () => {

    const transition = useTransition("a", {
        from: { x: 0, y: 100, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
    })

    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { menuId } = useParams()
    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const { menu, selectedBranch, selectedMenu } = useSelector((state: RootState) => state.branches)
    const [editMode, setEditMode] = useState(false)
    const [menuToBeEdited, setMenuToBeEdited] = useState<menuType | null>(null)
    const [orderChanged, setOrderChanged] = useState<boolean>(false)
    const [dndMenu, setDndMenu] = useState<Array<any>>([])

    // get all menu
    async function getMenu() {
        if (selectedShop && selectedBranch) {
            const ref = collection(db, "shops", selectedShop.id, "menu")
            const q = query(ref, where("branchId", "==", selectedBranch.id), where('status', "in", ["published", "unpublished", 'created']), orderBy("index"))
            const querySnapshot = await getDocs(q);
            const result = querySnapshot.docs.map(doc => doc.data())

            if (result.length > 0) {
                dispatch(setMenu(result)) // all the menu
                // const defaultMenu = menuId ? result.find((m, index) => m['id'] === menuId) : result[0]
                // if (!defaultMenu) {
                //     dispatch(setSelectedMenu(result[0]))
                //     navigate(`/${selectedShop.id}/${selectedBranch.id}/${result[0]['id']}`)
                // } else {
                //     dispatch(setSelectedMenu(defaultMenu))
                //     navigate(`/${selectedShop.id}/${selectedBranch.id}/${defaultMenu['id']}`)
                // }
            } else {
                dispatch(setSelectedMenu(null))
                navigate(`/${selectedShop.id}/${selectedBranch.id}`)
            }
        }
    }

    // update indices from dnd 
    async function updateIndex() {
        try {
            const batch = writeBatch(db)
            if (selectedShop) {
                dndMenu.forEach(async (m: any) => {
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

    useEffect(() => {
        getMenu()
    }, [editMode, selectedBranch, selectedShop])

    // filter and set menu
    useEffect(() => {
        if (selectedShop && selectedBranch) {
            const filteredMenu = menu.filter((fm: menuType) =>
                fm.branchId === selectedBranch?.id )
            if (filteredMenu.length > 0) {
                setDndMenu(filteredMenu)
                const defaultMenu = menuId ? filteredMenu.find((m, index) => m['id'] === menuId) : filteredMenu[0]
                if (!defaultMenu) {
                    dispatch(setSelectedMenu(filteredMenu[0]))
                    navigate(`/${selectedShop.id}/${selectedBranch.id}/${filteredMenu[0]['id']}`)
                } else {
                    dispatch(setSelectedMenu(defaultMenu))
                    navigate(`/${selectedShop.id}/${selectedBranch.id}/${defaultMenu['id']}`)
                }
            } else {
                setDndMenu([])
                dispatch(setSelectedMenu(null))
                navigate(`/${selectedShop.id}/${selectedBranch.id}`)
            }
        }
        return () => {
            setDndMenu([])
        }
    }, [menu, selectedBranch])


    // set selected menu
    const menuClicked = (m: menuType) => {
        dispatch(setSelectedMenu(m))
        navigate(`/${selectedShop?.id}/${selectedBranch?.id}/${m.id}`)
    }

    // Drag and Drop Function
    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result
        console.log(destination, source);
        
        if (!destination) return
        if (destination.index === source.index) return

        const finalResult = Array.from(dndMenu)  // we are copying the branches to a new variable for manipulation.
        const [removed] = finalResult.splice(source.index, 1)
        finalResult.splice(destination.index, 0, removed)
        const newData = finalResult.map((fs, index) => ({ ...fs, index }))
        setOrderChanged(true)
        setDndMenu(newData)
    }
    // console.log(dndMenu);
    

    return (
        <div style={{ position: "relative" }}>
            {/* Save Order Button */}
            {orderChanged ? <div >
                {transition((style, item) =>
                    item && <animated.div style={{
                        ...style, textAlign: "center",  margin: "auto",
                        // boxShadow: "0px 9px 9px rgba(229, 229, 229, 0.3)", 
                        backgroundColor: "white", padding: "15px",
                        borderRadius: "0px 0px 10px 10px"
                    }}>
                        {/* Save changes */}
                        <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "10px" }}>
                            <Button onClick={() => {
                                setOrderChanged(false);
                                setDndMenu(menu)
                            }} variant="outlined" size="small" color='error' >cancel</Button>
                            <Button onClick={async () => {
                                try {
                                    dispatch(setMenu(dndMenu))
                                    setOrderChanged(false);
                                    await updateIndex();
                                } catch (error) {

                                }
                            }}
                                variant="contained" size="small"
                            >
                                save
                            </Button>
                        </div>
                    </animated.div>
                )}
            </div>
            :
            <MenuForm editMode={editMode} setEditMode={setEditMode} menuToBeEdited={menuToBeEdited} /> 
            }
            <div>
                {transition((style: any) =>
                    <animated.div style={style}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <>
                                <Droppable droppableId="menuList" >
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>

                                            {dndMenu.map(m => (

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

            

        </div>
    )
}
