import { Card, CardActionArea, CardContent, CardMedia, IconButton, Radio, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../redux/store/store'
import { BottomNav } from './bottomNav'
import CloseIcon from '@mui/icons-material/Close';
import { addToCart } from '../redux/appSlice'

type Props = {}

export const Cart = (props: Props) => {

    const dispatch = useDispatch()
    const { cart } = useSelector((state: RootState) => state.appSlice)

    const removeFromCart = (toBeRemovedIndex: number) => {
        const filtered = cart.filter((item, index) =>  index !== toBeRemovedIndex)
        dispatch(addToCart(filtered))
    }

    return (
        <div>
            {cart.map((item, index) => (
                <Card key={item.id + Math.random() * 10} sx={{ maxWidth: "400px" }}>
                    <CardActionArea>
                        <IconButton sx={{ position: "absolute", right: 0 }}
                            onClick={() => removeFromCart( index)}
                        >
                            <CloseIcon />
                        </IconButton>
                        <CardMedia
                            component="img"
                            height="100"
                            width="100"
                            image={item.serviceImage}
                            alt={item.serviceName}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h6" component="div">
                                {item.serviceName}
                            </Typography>
                            {item.selectedOptions.map((so: any) => (
                                <div key={Math.random() + so.id}
                                    style={{ display: "flex", justifyContent: "space-around", alignItems: "center" }}
                                >
                                    <Typography variant='body1'>{so.name}</Typography>
                                    <Typography variant='body1'>{so.price}</Typography>
                                    <Radio checked />
                                </div>
                            ))}
                            <Typography sx={{ textAlign: "right" }}>{item.price
                            }</Typography>

                        </CardContent>
                    </CardActionArea>
                </Card>
            ))}

            <div style={{
                marginTop: "10px", width: "100%", height: "40px",
                background: "#FFFFFF", boxShadow: "0px -2px 8px rgba(104, 104, 115, 0.2)",
            }}>
                Total:
            </div>

            <BottomNav />
        </div>
    )
}