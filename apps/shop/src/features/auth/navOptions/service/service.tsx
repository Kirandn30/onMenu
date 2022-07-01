import { RootState } from "../../../../redux/store";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Branch } from "./branches/Branch";
import { branchesType, setBranch } from "../../../../redux/services";
import { useEffect, useState } from "react";
import { SaveChanges } from "./branches/saveChanges";
import { Menu } from "./menu/menu";
import { Catagories } from "./catagorie/Catagories ";
import { Servicecard } from "./servicecard/Servicecard";
import { useNavigate, useParams } from "react-router-dom";

export const Service = () => {
    const dispatch = useDispatch()
    const { branches } = useSelector((state: RootState) => state.branches)
    const navigate = useNavigate()
    const { shopid } = useParams()
    const [localBranches, setLocalBranches] = useState<branchesType[]>([])
    const [isReodrded, setIsReodrded] = useState(false)
    const onDragEnd = (result: DropResult) => {
        const { destination, source } = result
        if (!destination) return
        if (destination.index === source.index) return
        console.log(result.source.index, result.destination?.index)
        const finalResult = Array.from(localBranches)  // we are copying the branches to a new variable for manipulation.
        const [removed] = finalResult.splice(source.index, 1)
        finalResult.splice(destination.index, 0, removed)
        const newData = finalResult.map((branch, index) => ({ ...branch, index }))
        console.log(newData);
        setLocalBranches(newData)
        setIsReodrded(true)
    }

    return (
        <div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Branch localBranches={localBranches} setLocalBranches={setLocalBranches} />
            </DragDropContext>
            <SaveChanges setLocalBranches={setLocalBranches} localBranches={localBranches} setIsReodrded={setIsReodrded} isReodrded={isReodrded} />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", marginTop: "30px" }}>
                <div className="serviceCards"><Menu /></div>
                {/* <div className="serviceCards"><Catagories /></div> */}
                <div className="serviceCards"><Servicecard /></div>
            </div>
        </div>
    )
}
