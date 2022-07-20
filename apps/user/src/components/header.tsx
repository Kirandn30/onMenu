import { Typography } from '@mui/material'
import { useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'
import DrawerLeft from './drawerLeft'
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';

export const Header = () => {

    const { selectedBranch } = useSelector((state: RootState) => state.appSlice)

    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
            <DrawerLeft />
            {selectedBranch && <div style={{display: "flex", margin: "0px 10px"}}>
                <LocationOnOutlinedIcon />
                <Typography>{selectedBranch.branchName}</Typography>
            </div>}
        </div>
    )
}