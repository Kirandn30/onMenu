import { createSlice } from '@reduxjs/toolkit'

export interface authState {
    shops: null | shopstype[]
    selectedShop: null | shopstype
}

const initialState: authState = {
    shops: null,
    selectedShop: null
}

export const shopSlice = createSlice({
    name: 'shop',
    initialState,
    reducers: {
        Setshops: (state, action) => {
            state.shops = action.payload
        },
        setselectedShop: (state, action) => {
            state.selectedShop = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { Setshops, setselectedShop } = shopSlice.actions

export default shopSlice.reducer


export interface shopstype {
    registered: boolean;
    shopName: string;
    enabled: boolean;
    adminEmail: string;
    role: string;
    id: string;
}

export interface paymentsType {
    id: string,
    name: string,
    contact: string,
    status: string,
    timeStamp: any,
    amount: string,
    by: string,
}