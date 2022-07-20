import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Branch } from "./branches/Branch";
import { branchesType } from "../../../../redux/services";
import { useState } from "react";
import { SaveChanges } from "./branches/saveChanges";
import { MenuItems } from "./menu/menus";
import { Servicecard } from "./servicecard/serviceCards";
import { useMediaQuery, useTheme } from "@mui/material";

export const Service = () => {

    const theme = useTheme()
    const media = useMediaQuery(theme.breakpoints.up('md'))
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
            <SaveChanges setLocalBranches={setLocalBranches} localBranches={localBranches}
                setIsReodrded={setIsReodrded} isReodrded={isReodrded}
            />

            <div style={{
                display: "grid", gridTemplateColumns: media ? "1fr 1fr" : "1fr", gap: "60px",
                marginTop: "30px", justifyItems: "center"
            }}>
                <div className="serviceCards" ><MenuItems /></div>
                <div className="serviceCards"><Servicecard /></div>
            </div>

        </div>
    )
}
