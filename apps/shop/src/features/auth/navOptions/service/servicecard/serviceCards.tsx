import { useEffect, useState } from 'react'
import { useTransition, animated } from "react-spring"
import { ServiceCardForm } from './serviceCardForm'
import { collection, doc, getDocs, orderBy, query, updateDoc, writeBatch } from 'firebase/firestore'
import { RootState } from 'apps/shop/src/redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { db } from 'apps/shop/src/config/firebase'
import { serviceType, setSelectedService, setServices } from 'apps/shop/src/redux/services'
import ServiceCard from './serviceCard'
import { DragDropContext, Draggable, Droppable, DropResult } from 'react-beautiful-dnd'
import { Button } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'

export const Servicecard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { menuId, serviceId } = useParams()
    const { selectedShop } = useSelector((state: RootState) => state.shop)
    const { services, selectedBranch, selectedMenu } = useSelector((state: RootState) => state.branches)
    const [editMode, setEditMode] = useState(false)
    const [serviceToBeEdited, setServiceToBeEdited] = useState<serviceType | null>(null)
    const [orderChanged, setOrderChanged] = useState<boolean>(false)
    const [filteredServices, setFilteredServices] = useState<Array<serviceType>>([])

    const transition = useTransition("a", {
        from: { x: 0, y: 100, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
    })

    async function getServices() {
        try {
            if (selectedShop && selectedBranch && selectedMenu) {
                const ref = collection(db, "shops", selectedShop.id, "services")
                const q = query(ref, orderBy("index"));
                const querySnapshot = await getDocs(q);
                const result = querySnapshot.docs.map(doc => doc.data())

                if (result.length > 0) {
                    dispatch(setServices(result)) // all the services  

                    const defaultService = serviceId ? result.find((s) => s['id'] === serviceId) : result[0]
                    if (!defaultService) {
                        dispatch(setSelectedService(result[0]))
                        navigate(`/${selectedShop.id}/${selectedBranch.id}/${selectedMenu.id}/${result[0]['id']}`)
                    } else {
                        dispatch(setSelectedService(defaultService))
                        navigate(`/${selectedShop.id}/${selectedBranch.id}/${selectedMenu.id}/${defaultService['id']}`)
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function updateIndex() {
        try {
            const batch = writeBatch(db)
            if (selectedShop) {
                filteredServices.forEach(async s => {
                    const branchesRef = doc(db, "shops", selectedShop.id, "services", s.id);
                    batch.update(branchesRef, {
                        index: s.index
                    })
                })
                await batch.commit()
            }
        } catch (error) {
            console.log(error);

        }
    }

    //To filter services
    useEffect(() => {
        if (selectedMenu) {
            const filtered = services.filter((fs) => fs.menuId == selectedMenu.id)
            setFilteredServices(filtered)
        }
    }, [services, selectedMenu, selectedBranch])

    useEffect(() => {
        getServices()
    }, [editMode, selectedShop, selectedBranch, selectedMenu])

    // Drag and Drop Function
    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result
        if (!destination) return
        if (destination.index === source.index) return

        const finalResult = Array.from(filteredServices)  // we are copying the branches to a new variable for manipulation.
        const [removed] = finalResult.splice(source.index, 1)
        finalResult.splice(destination.index, 0, removed)
        const newData = finalResult.map((fs, index) => ({ ...fs, index }))
        setFilteredServices(newData)
        setOrderChanged(true)
        // const toUpdate = services.filter((fs) => fs.menuId !== selectedMenu?.id)
        dispatch(setServices({ ...services, filteredServices }))
    }

    return (
        <>
            <div>
                {transition((style: any) =>
                    <animated.div style={style}>
                        <DragDropContext onDragEnd={onDragEnd}>
                            <>
                                {/* Service Card Form */}
                                <ServiceCardForm editMode={editMode} setEditMode={setEditMode} serviceToBeEdited={serviceToBeEdited} />

                                <Droppable droppableId="serviceList" >
                                    {(provided) => (
                                        <div ref={provided.innerRef} {...provided.droppableProps}>

                                            {filteredServices.map((s: serviceType) => (

                                                <Draggable key={s.id} draggableId={s.id} index={s.index}>
                                                    {(provided, snapshot) => (
                                                        <div ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                        >
                                                            {/* Service card */}
                                                            <ServiceCard key={s.id} s={s} setEditMode={setEditMode}
                                                                setServiceToBeEdited={setServiceToBeEdited} />
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
                    </animated.div >
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
