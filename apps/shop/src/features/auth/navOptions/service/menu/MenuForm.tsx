import { Button, Typography } from '@mui/material'
import InputField from '../../../../../ui-components/Input'
import React, { useState } from 'react'
import { MiuracImage } from '@on-menu/miurac-image'
import { app } from '../../../../../config/firebase'
import { Login } from '../../../login'
import { CloudUploadOutlined } from '@mui/icons-material'

export const MenuForm = () => {
    const [menuImage, setMenuImage] = useState<string | null>(null)
    const [open, setopen] = useState(false)
    return (
        <div>
            <Typography align='center' variant='h6'>MenuForm</Typography>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 4fr", marginTop: "30px", alignItems: "center", gap: "15px", justifyItems: "left" }}>
                <div>
                    <label>Menu Name:</label>
                </div>
                <div>
                    <InputField placeholder='Menu Name' fullWidth />
                </div>
                <div style={{ alignSelf: "start" }}>
                    Upload Image:
                </div>
                <div>
                    <div >
                        {menuImage ? (
                            <img width="450px" height="150px" src={menuImage} alt="menu" />
                        ) : (
                            <MiuracImage app={app} authComponent={<Login />} buttonComponent={<Upload />} updateFirestore={true} editConfig={{ aspectX: 3, aspectY: 1 }} setUrlFunc={(url) => setMenuImage(url)} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

const Upload = () => {
    return (
        <div style={{
            backgroundColor: "#fbfbff", height: "150px", width: "450px", border: "1px dashed #D3D3D3", borderRadius: "10px", borderSpacing: "10px", display: "flex", justifyContent: "center", alignItems: "center"
        }}>
            <Button fullWidth style={{ height: "150px" }}>
                <div>
                    <CloudUploadOutlined style={{ color: "#696969", }} />
                    <Typography style={{ color: "#D3D3D3" }} display="block" variant='caption'>upload a image for menu</Typography>
                </div>
            </Button>
        </div>
    )
}