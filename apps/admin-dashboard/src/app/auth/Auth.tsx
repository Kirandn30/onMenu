import React, { useState } from 'react'
import { firebase } from '../../../firebase';
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { Alert, Button, Card, Snackbar } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setUser } from './authSlice';
import img from "../../assets/images/20944201.jpg"

export const Auth = () => {

    const provider = new GoogleAuthProvider()
    const dispatch = useDispatch()
    const [warn, setWarn] = useState(false)
    const auth = getAuth(firebase);
    const onSubmit = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                if (!credential) return
                const user = result.user;
                if (user.uid === 'lgNXbD1hvzdmbFObz4e5Y7KwjM03') {
                    dispatch(setUser(user))
                }
                else {
                    setWarn(true)
                }
            }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // ...
            });
    }


    return (
        <div style={{ height: "85vh", width: "100vw", backgroundColor: "#F6F7FA" }}>
            <div style={{ width: "400px", display: "flex", flexDirection: "column", alignContent: "center", height: "500px", margin: "auto", backgroundColor: "white", boxShadow: "0px 4px 8px rgba(154, 207,255,0.15)", borderRadius: "20px" }}>
                <img width="80%" src={img} alt="logo" />
                <Button variant='contained' onClick={onSubmit}>login</Button>
            </div>
            <Snackbar open={warn} autoHideDuration={6000} onClose={() => setWarn(false)}>
                <Alert onClose={() => setWarn(false)} severity="warning" >
                    You're not authorized
                </Alert>
            </Snackbar>
        </div>
    )
}
