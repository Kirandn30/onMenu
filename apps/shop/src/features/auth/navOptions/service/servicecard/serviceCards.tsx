import { useEffect, useState } from 'react'
import { useTransition, animated } from "react-spring"
import { ServiceCardForm } from './serviceCardForm'
import { collection, doc, getDocs, orderBy, query, updateDoc, where, writeBatch } from 'firebase/firestore'
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
    const [filteredServices, setFilteredServices] = useState<Array<serviceType> | null>([])
    const [dndServices, setDndServices] = useState<Array<any>>([])

    const transition = useTransition("a", {
        from: { x: 0, y: 100, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
    })

    // Get all services
    async function getServices() {
        try {
            if (selectedShop && selectedBranch && selectedMenu) {
                const ref = collection(db, "shops", selectedShop.id, "services")
                const q = query(ref, where("menuId", "==", selectedMenu.id),
                    where("status", "in", ["published", "unpublished"]), orderBy("index"));
                const querySnapshot = await getDocs(q);
                const result = querySnapshot.docs.map(doc => doc.data())

                dispatch(setServices(result)) // set services to state

                // const defaultService = serviceId ? result.find((s) => s['id'] === serviceId) : result[0]
                // if (!defaultService) {
                //     dispatch(setSelectedService(result[0]))
                //     navigate(`/${selectedShop.id}/${selectedBranch.id}/${selectedMenu.id}/${result[0]['id']}`)
                // } else {
                //     dispatch(setSelectedService(defaultService))
                //     navigate(`/${selectedShop.id}/${selectedBranch.id}/${selectedMenu.id}/${defaultService['id']}`)
                // }

            }
        } catch (error) {
            console.log(error);
        }
    }

    // update indices to db after D&D
    async function updateIndex() {
        try {
            const batch = writeBatch(db)
            if (selectedShop && dndServices) {
                dndServices.forEach(async s => {
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

    useEffect(() => {
        getServices()
    }, [editMode, selectedShop, selectedBranch, selectedMenu])

    useEffect(() => {
        if (services.length > 0) {
            setDndServices(services) // Services copy for dnd
        } else {
            setDndServices([])
        }
    }, [services, selectedMenu])

    // Drag and Drop Function
    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result
        if (!destination) return
        if (destination.index === source.index) return

        const finalResult = Array.from(dndServices)  // we are copying the branches to a new variable for manipulation.
        const [removed] = finalResult.splice(source.index, 1)
        finalResult.splice(destination.index, 0, removed)
        const newData = finalResult.map((fs, index) => ({ ...fs, index }))
        setDndServices(newData)
        setOrderChanged(true)
    }
    console.log(dndServices);
    return (

        <div style={{ position: "relative" }}>
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

                                            {dndServices.map((s: serviceType) => (

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
            {orderChanged && <div style={{ position: "absolute", top: 0, left: "20%" }}>
                {transition((style, item) =>
                    item && <animated.div style={{
                        ...style, textAlign: "center", width: "20vw", margin: "auto",
                        boxShadow: "0px 9px 9px rgba(229, 229, 229, 0.3)", backgroundColor: "white", padding: "15px",
                        borderRadius: "0px 0px 10px 10px"
                    }}>
                        Save changes
                        <div style={{ display: "flex", justifyContent: "center", gap: "30px", marginTop: "10px" }}>
                            <Button onClick={() => {
                                setOrderChanged(false)
                                setDndServices(services)
                            }}
                                variant="outlined" size="small"
                            >cancel
                            </Button>
                            <Button onClick={async () => {
                                setOrderChanged(false);
                                await updateIndex()
                                dispatch(setServices(dndServices))
                            }}
                                variant="contained" size="small"
                            >save
                            </Button>
                        </div>
                    </animated.div>
                )}
            </div>}
        </div>

    )
}
