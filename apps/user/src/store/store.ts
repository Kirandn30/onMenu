import { configureStore } from '@reduxjs/toolkit'
import UserReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    User: UserReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch