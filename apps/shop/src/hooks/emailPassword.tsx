import { FirebaseApp } from 'firebase/app'
import React from 'react'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, signOut } from "firebase/auth";
import { setError, setNotification, setUser } from '../redux/auth';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setselectedShop } from '../redux/shops';


type useEmailPasswordProps = {
    app: FirebaseApp
}

export const useEmailPassword = ({ app }: useEmailPasswordProps) => {
    const auth = getAuth(app)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const signUp = async (email: string, password: string) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)

        } catch (error: any) {
            dispatch(setError(error.message))
        }
    }

    const signIn = async (email: string, password: string) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error: any) {
            dispatch(setError(error.message))
        }
    }

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(auth, email)
            dispatch(setNotification(`Password reset mail sent to ${email}`))
            console.log("sent");

        } catch (error: any) {
            dispatch(setError(error.message))
        }

    }

    const logOut = async () => {
        try {
            await signOut(auth)
            navigate("/")
            dispatch(setselectedShop(null))
        } catch (error: any) {
            dispatch(setError(error.message))
        }
    }


    return { signUp, signIn, resetPassword, logOut }
}
