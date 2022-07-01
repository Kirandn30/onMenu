import { Typography } from '@mui/material'
import React from 'react'
import add from "../../../../../assets/add.svg"
import { useTransition, animated } from "react-spring"

export const Servicecard = () => {
    const transition = useTransition("a", {
        from: { x: 0, y: 100, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
    })

    return (
        transition((style: any) =>
            <animated.div style={style}>
                <div style={{ display: "grid", gridTemplateColumns: "11fr 1fr", alignItems: "center" }}>
                    <Typography align='center' variant='h6'> Service card</Typography>
                    <img className='add' src={add} alt="add" />
                </div>
            </animated.div>
        )
    )
}
