import { Badge, IconButton } from '@mui/material'
import ThumbsUpDownOutlinedIcon from '@mui/icons-material/ThumbsUpDownOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PowerSettingsNewOutlinedIcon from '@mui/icons-material/PowerSettingsNewOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PaymentOutlinedIcon from '@mui/icons-material/PaymentOutlined';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';

export const BottomNav = () => {

    const navigate = useNavigate()
    const { shopId, branchId, menuId } = useParams()
    const { cart } = useSelector((state: RootState) => state.appSlice)

    const iconButtonStyles: React.CSSProperties = {
        fontSize: "10px",
        textAlign: "center",
        width: "78px",
    }

    const bottomNavStyles: React.CSSProperties = {
        background: "#FFFFFF",
        boxShadow: "0px -2px 8px rgba(104, 104, 115, 0.2)",
        position: "fixed",
        left: "0",
        bottom: "0",
        width: "100%",
    }

    const menuButton: React.CSSProperties = {
        background: "#FFFFFF",
        boxShadow: "0px -2px 4px rgba(104, 104, 115, 0.2)",
        position: "fixed",
        bottom: "1px",
        left: "156px"
    }
    return (
        <div style={bottomNavStyles}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                    <IconButton sx={iconButtonStyles} onClick={() => navigate(`/${shopId}/${branchId}/${menuId}/feedback`)}>
                        <div>
                            <ThumbsUpDownOutlinedIcon />
                            <p style={{ margin: 0 }}>Feedback</p>
                        </div>
                    </IconButton>
                    <IconButton sx={iconButtonStyles} onClick={() => navigate(`/${shopId}/${branchId}/${menuId}/search`)}>
                        <div>
                            <SearchOutlinedIcon />
                            <p style={{ margin: 0 }}>Search</p>
                        </div>
                    </IconButton>
                </div>
                <div>
                    <IconButton sx={iconButtonStyles} onClick={() => navigate(`/${shopId}/${branchId}/${menuId}/cart`)}>
                        <div>
                            <Badge badgeContent={cart.length} color={'primary'}>
                                <ShoppingCartOutlinedIcon />
                            </Badge>
                            <p style={{ margin: 0 }}>Cart</p>
                        </div>
                    </IconButton>
                    <IconButton sx={iconButtonStyles} onClick={() => navigate(`/${shopId}/${branchId}/${menuId}/payment`)}>
                        <div>
                            <PaymentOutlinedIcon />
                            <p style={{ margin: 0 }}>Payment</p>
                        </div>
                    </IconButton>
                </div>
            </div>

            <IconButton sx={{ ...iconButtonStyles, ...menuButton }} onClick={() => navigate(`/${shopId}/${branchId}/${menuId}`)}>
                <div>
                    <PowerSettingsNewOutlinedIcon />
                    <p style={{ margin: "10px 0px" }}>Menu</p>
                </div>
            </IconButton>

        </div>
    )
}