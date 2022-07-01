import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { getAuth, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendEmailVerification, User } from "firebase/auth";
// import { app } from '../firebaseConfig/config';
import { collection, addDoc, setDoc, doc, getDoc, query, where, getDocs } from "firebase/firestore";
// import { db } from "../firebaseConfig/config"

type UserDetailState = {
  loading: boolean,
  step: 'phone' | 'otp'
  error: {
    errorCode: number,
    message: string
  } | null,
  user: User | null | undefined
  phoneNumber: null | number
}

const initialState: UserDetailState = {
  loading: true,
  error: null,
  user: undefined,
  step: "phone",
  phoneNumber: null
}

export const UserSlice = createSlice({
  name: 'User',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload
      state.loading = false
      state.error = null
    },
    setStep: (state, action) => {
      state.step = action.payload
    },
    setPhone: (state, action) => {
      state.phoneNumber = action.payload
    },
    setUserError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    setUserLoading: (state) => {
      state.loading = true
    },
    removeUserLoading: state => {
      state.loading = false
    },
    removeUserError: (state) => {
      state.error = null

    }
  },
})

export const { setUser, setUserError, setUserLoading, removeUserError, removeUserLoading, setStep, setPhone } = UserSlice.actions

export default UserSlice.reducer