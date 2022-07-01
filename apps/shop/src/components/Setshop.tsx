import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { setselectedShop } from "../redux/shops"
import { RootState } from "../redux/store"


export const SetShop = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const { shops } = useSelector((state: RootState) => state.shop)
    const navigate = useNavigate()
    console.log(params['shopid'], "paramas");
    useEffect(() => {
        console.log(params['shopid'], "paramas");
        if (params['shopid']) {
            const selectedShop = shops?.find((shop) => shop.id === params['shopid'])
            if (!selectedShop) navigate("/")
            else dispatch(setselectedShop(selectedShop))
        }
    }, [])

    return null
}