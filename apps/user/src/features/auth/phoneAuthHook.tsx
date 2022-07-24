import { logEvent } from 'firebase/analytics';
import { FirebaseApp, FirebaseError } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { analytics, db } from '../../configs/firebaseConfig';
import { removeUserError, removeUserLoading, setPhone, setStep, setUser, setUserError, setUserLoading } from '../../redux/authSlice';
import { RootState } from '../../redux/store/store';

type stepType = 'phone' | 'otp'

export default function usePhoneAuth(app: FirebaseApp, redirectUrl?: string): { sendOtp: (phone: string) => void, verifyOtp: (otp: string) => void, logout: () => void } {
    const auth = getAuth(app);
    const dispatch = useDispatch()
    const { name, phoneNumber } = useSelector((state: RootState) => state.User)
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        if (!window.recaptchaVerifier) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            window.recaptchaVerifier = new RecaptchaVerifier('sign-in-button', {
                'size': 'invisible',
            }, auth);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
        }

        // return () => {
        //     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //     //@ts-ignore
        //     window.recaptchaVerifier = null
        // }
    }, [])


    const sendOtp = async (phone: string) => {
        try {
            dispatch(setUserLoading())
            console.log('otp func', phone);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await signInWithPhoneNumber(auth, phone, appVerifier)
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //@ts-ignore
            window.confirmationResult = confirmationResult;
            dispatch(setStep("otp"))
            dispatch(setPhone(phone))
            dispatch(removeUserError())
            dispatch(removeUserLoading())
            // console.log("checking")
            // console.log("working")
        } catch (error) {
            dispatch(setUserError(error))
            // setStep("otp")
        }


    }
    const verifyOtp = (code: string) => {
        dispatch(setUserLoading())
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        window.confirmationResult.confirm(code).then((result) => {
            const user = result.user
            dispatch(setUser(user))
            if (auth.currentUser)
                updateProfile(auth.currentUser, {
                    displayName: name
                })
            // window.location.href = redirectUrl ?? '/' // code translation :  redirectUrl??'/' =  redirectUrl?redirectUrl:'/'
        }).catch((error: FirebaseError) => {
            dispatch(setUserError(error))
        });
    }

    const logout = () => {
        signOut(auth).then(() => {
            dispatch(setUser(null))
            // logEvent(analytics,'user-logged-out')
        }).catch((error) => {
            dispatch(setUserError(error))
        });
    }

    return { sendOtp, verifyOtp, logout }
}

// export async function addUser(name: string, phone: number, id: string) {
//     const ref = doc(db, "users", id)
//     await setDoc(ref, {
//         name: name,
//         phoneNumber: phone
//     });
// }