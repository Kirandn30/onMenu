import { configureStore } from '@reduxjs/toolkit'
import appSlice from '../appSlice';
import UserReducer from '../authSlice';

export const store = configureStore({
  reducer: {
    User: UserReducer,
    appSlice: appSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  })
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch