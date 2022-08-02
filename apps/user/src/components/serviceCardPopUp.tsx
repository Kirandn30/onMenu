import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import CloseIcon from '@mui/icons-material/Close';
import { Button, Card, CardActionArea, CardContent, CardMedia, Checkbox, IconButton, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { addToCart, serviceType, setSelectedOptions } from '../redux/appSlice';

const drawerWidth = "100%";

type serviceCardDetailsProps = {
    setViewDetails: React.Dispatch<React.SetStateAction<boolean>>
    viewDetails: boolean
    popUpService: serviceType | null
}

export function ServiceCardPopUp({ setViewDetails, viewDetails, popUpService }: serviceCardDetailsProps) {

    const dispatch = useDispatch()
    const { selectedService, cart, selectedOptions } = useSelector((state: RootState) => state.appSlice)
    const [viewDetailsLocal, setViewDetailsLocal] = useState(false)
    const [popUpServiceLocal, setPopUpServiceLocal] = useState<serviceType | null>(null)


    const handleClick = () => {
        const price = calcServiceTotal(selectedService, selectedOptions)
        dispatch(addToCart([...cart, { ...selectedService, selectedOptions: selectedOptions, price: price }]))
        setViewDetails(false)
        dispatch(setSelectedOptions([]))
    }
    const handleClose = () => {
        setViewDetails(false)
        dispatch(setSelectedOptions([]))
    }

    const handleRecommendation = (recomService: any) => {
        setPopUpServiceLocal(recomService)
        setViewDetailsLocal(true)
    }

    const addOptions = ({ io, maxAllow, optionIndex }: { io: any, maxAllow: string, optionIndex: number }) => {
        if (selectedOptions.find(
            selected => selected.id === io.id && selected.optionIndex === optionIndex)) {
            dispatch(setSelectedOptions(selectedOptions.filter((selected) => {
                if (selected.id === io.id && selected.optionIndex === optionIndex) {
                    return false
                } else { return true }
            })))
        } else {
            if (selectedOptions.filter(
                selected => selected.optionIndex === optionIndex).length < +maxAllow) {
                dispatch(setSelectedOptions([...selectedOptions, { optionIndex, ...io, id: io.id }]))
            }
        }
    }

    const calcServiceTotal = (selectedService: any, selectedOptions: any) => {
        var total = parseFloat(selectedService.price)
        // console.log('price',{selectedVariant,selectSubVariant,selectedAddons,quantity,recommended});
        total = selectedOptions.length > 0 ? selectedOptions.reduce(function (a: any, b: any) {
            return a + parseFloat(b['price']);
        }, total) : total
        // total = selectedAddons.length > 0 ? selectedAddons.reduce(function (a, b) {
        //     return a + parseFloat(b['price']);
        // }, total) : total
        // if (packingCharge > 0) {
        //     total = total + parseFloat(packingCharge)
        // }
        // var total = quantity ? quantity * total : total
        return total
    }

    const bottomNavStyles: React.CSSProperties = {
        height: "50px",
        background: "#FFFFFF",
        boxShadow: "0px -2px 8px rgba(104, 104, 115, 0.2)",
        position: "fixed",
        left: "0",
        bottom: "0",
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0px 15px 0px 15px"

    }

    return (
        <Box >
            {/* <CssBaseline /> */}
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth + 20,
                        boxSizing: 'border-box',
                    },
                }}
                anchor="bottom"
                open={viewDetails}
                onClose={handleClose}
            >
                <CssBaseline />
                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>

                <div style={{ height: "400px", marginBottom: "100px", paddingBottom: "50px" }}>
                    <img src={popUpService?.serviceImage} alt={popUpService?.serviceName} width="100%" />
                    <Typography variant='h5'>{popUpService?.serviceName}</Typography>
                    <Typography variant='body1'>{popUpService?.description}</Typography>
                    <div style={{ display: "flex" }}>
                        <AccessTimeIcon />
                        <Typography variant='body1'>
                            Estimated Time: {popUpService?.estimatedTime} mins
                        </Typography>
                    </div>
                    {popUpService?.options.map((o, index) => (
                        <div key={o.id}>
                            {o.title}
                            {o.innerOptions.map((io) => (
                                <div key={io.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-around" }}
                                    onClick={() => { addOptions({ io, maxAllow: o.maxallow, optionIndex: index }) }}
                                >
                                    <Typography>{io.name}</Typography>
                                    <Typography>{io.price}</Typography>
                                    <Checkbox checked={Boolean(selectedOptions.find(
                                        (selected) =>
                                            selected.id === io.id &&
                                            index === selected.optionIndex
                                    ))} />
                                </div>
                            ))}
                        </div>
                    ))}
                    <div>
                        <Typography>Recommendations: </Typography>
                        {popUpService?.recommended.map(rs => (
                            <Card key={rs.id} sx={{ maxWidth: "200px", height: "200px" }}
                                onClick={() => handleRecommendation(rs)}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={rs.serviceImage}
                                        alt={rs.serviceName}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h6" component="div">
                                            {rs.serviceName}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {rs.price}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </div>
                </div>

                <div style={bottomNavStyles}>
                    {popUpService?.price}
                    <Button sx={{ height: "40px", width: "80px" }} size='small'
                        variant="contained" onClick={handleClick}>
                        Book
                    </Button>
                </div>

            </Drawer>

            {viewDetailsLocal && <ServiceCardPopUp setViewDetails={setViewDetailsLocal} viewDetails={viewDetailsLocal} popUpService={popUpServiceLocal}/>}
        </Box>
    );
}

