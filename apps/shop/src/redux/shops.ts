import { createSlice } from '@reduxjs/toolkit'

export interface shopSate {
    shops: null | shopstype[]
    selectedShop: null | shopstype,
    loyalties: loyaltyType[]
}

const initialState: shopSate = {
    shops: null,
    selectedShop: null,
    loyalties: [],
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
        },
        addLoyalty: (state, action) => {
            state.loyalties = [...state.loyalties, action.payload]
        },
        addLoyalties: (state, action) => {
            state.loyalties = action.payload
        }
    },
})

// Action creators are generated for each case reducer function
export const { Setshops, setselectedShop, addLoyalty, addLoyalties } = shopSlice.actions

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

export interface loyaltyType {
    id: string;
    loyaltyName: string;
    minVisit: number | null;
    maxVisit: number | null;
    exactVisit: number | null;
    minSpend: number | null;
    maxSpend: number | null;
    minDays: number | null;
    maxDays: number | null;
}