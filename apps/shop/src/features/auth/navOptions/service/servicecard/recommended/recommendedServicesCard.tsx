import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { serviceType } from 'apps/shop/src/redux/services'
import React from 'react'

type Props = {
    s: serviceType
}

export const RecommendedServicesCard = ({s}: Props) => {
    return (
        <div>
            <Card sx={{width: 180, padding: 0,}}>
                <CardMedia
                    component="img"
                    height="100"
                    image={s.serviceImage}
                    alt={s.serviceName + " image"}
                />
                <CardContent sx={{padding: 0, }}>
                    <Typography variant="subtitle1" component="div">
                        {s.serviceName}
                    </Typography>
                </CardContent>
            </Card>
        </div>
    )
}