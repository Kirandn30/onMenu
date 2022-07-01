import { createSlice } from '@reduxjs/toolkit'
import { User } from 'firebase/auth'

export interface authState {
    User: User | null
    loading: boolean
    error: null | string
    notification: null | string
}

const initialState: authState = {
    User: null,
    loading: true,
    error: null,
    notification: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.User = action.payload
            state.loading = false
        },
        setError: (state, action) => {
            state.error = action.payload
            state.loading = false
        },
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setNotification: (state, action) => {
            state.notification = action.payload
        }
    }
})

// Action creators are generated for each case reducer function
export const { setUser, setError, setLoading, setNotification } = authSlice.actions

export default authSlice.reducer