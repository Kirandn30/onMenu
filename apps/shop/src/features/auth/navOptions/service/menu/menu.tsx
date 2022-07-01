import { Typography } from '@mui/material'
import React, { useState } from 'react'
import add from "../../../../../assets/add.svg"
import { useTransition, animated } from "react-spring"
import { Simplemodal } from '../../../../../components/modal'
import { MenuForm } from './MenuForm'

export const Menu = () => {
    const [showMenuForm, setShowMenuForm] = useState(false)
    const transition = useTransition("a", {
        from: { x: 0, y: 100, opacity: 0 },
        enter: { x: 0, y: 0, opacity: 1 },
    })

    return (
        transition((style: any) =>
            <animated.div style={style}>
                <div style={{ display: "grid", gridTemplateColumns: "11fr 1fr", alignItems: "center" }}>
                    <Typography align='center' variant='h6'> Menu</Typography>
                    <img onClick={() => setShowMenuForm(true)} className='add' src={add} alt="add" />
                </div>
                <Simplemodal style={{ height: "55vh", width: "50vw" }} onClose={() => setShowMenuForm(false)} open={showMenuForm}>
                    <MenuForm />
                </Simplemodal>
            </animated.div>
        )
    )
}
