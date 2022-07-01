import { configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import auth from './auth'
import shop from "./shops"
import service from "./services"

const store = configureStore({
    reducer: {
        auth: auth,
        shop: shop,
        branches: service
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false
        }),
})

export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch // Export a hook that can be reused to resolve types
export type RootState = ReturnType<typeof store.getState>

export default store