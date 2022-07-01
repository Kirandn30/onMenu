import { Typography } from "@mui/material"
import { setselectedShop, shopstype } from "../../redux/shops"
import { RootState } from "../../redux/store"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"


export const Shopcard = () => {

    const { shops } = useSelector((state: RootState) => state.shop)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    return (
        <div id="card">
            {shops?.map((shop: shopstype, id: number) => (
                <div onClick={() => { navigate(`/${shop.id}`); dispatch(setselectedShop(shop)) }} key={id} className="location" style={{ width: "100%", height: "100px", borderRadius: "15px", boxShadow: "0px 6px 15px rgba(62, 124, 227, 0.1)", cursor: "pointer", display: "flex" }}>
                    <div style={{ width: "30%", backgroundColor: "#42a5f5", height: "100%", borderRadius: "15px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography color="white" fontWeight={800} variant="h2">{shop.shopName.toUpperCase().charAt(0)}</Typography>
                    </div>
                    <div style={{ width: "70%", height: "100%", borderRadius: "15px", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Typography fontWeight={500} variant="h6">{shop.shopName}</Typography>
                    </div>
                </div>
            ))}
        </div>
    )
}
