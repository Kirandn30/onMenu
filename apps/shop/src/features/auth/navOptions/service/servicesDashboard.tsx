import { branchesType } from "../../../../redux/services";
import { useState } from "react";
// import { SaveChanges } from "./branches/saveChanges";
import { MenuItems } from "./menu/menus";
import { Servicecard } from "./servicecard/serviceCards";
import { useMediaQuery, useTheme } from "@mui/material";
import { Branches } from "./branches/Branches";

export const Service = () => {

    const theme = useTheme()
    const media = useMediaQuery(theme.breakpoints.up('md'))
    const [localBranches, setLocalBranches] = useState<branchesType[]>([])

    return (
        <div>
            <Branches localBranches={localBranches} setLocalBranches={setLocalBranches} />
            <div style={{
                display: "grid", gridTemplateColumns: media ? "1fr 1fr" : "1fr", gap: "60px",
                marginTop: "30px", justifyItems: "center",
            }}>
                <div className="serviceCards" ><MenuItems /></div>
                <div className="serviceCards" ><Servicecard /></div>
            </div>

        </div>
    )
}
