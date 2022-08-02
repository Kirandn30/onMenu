import { createSlice } from '@reduxjs/toolkit'

export interface serviceState {
    branches: branchesType[]
    status: string
    loading: boolean
    selectedBranch: branchesType | null
    selectedMenu: menuType | null
    selectedService: serviceType | null
    menu: menuType[]
    services: serviceType[]
}

const initialState: serviceState = {
    branches: [],
    status: "loading",
    loading: false,
    selectedBranch: null,
    selectedMenu: null,
    selectedService: null,
    menu: [],
    services: [],
}

export const serviceSlice = createSlice({
    name: 'service',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setBranch: (state, action) => {
            state.branches = action.payload
            state.selectedBranch = action.payload[0]
            state.status = "idle"
        },
        setBranches: (state, action) => {
            state.branches = action.payload
            state.status = "idle"
        },
        addBranches: (state, action) => {
            state.branches = [...state.branches, ...action.payload]
            state.status = "idle"
        },
        addBranch: (state, action) => {
            state.branches = [...state.branches, action.payload]
            state.status = "idle"
        },
        setSelectedBranches: (state, action) => {
            state.selectedBranch = action.payload
            state.status = "idle"
        },
        setMenu: (state, action) => {
            state.menu = action.payload
            state.status = "idle"
        },
        setSelectedMenu: (state, action) => {
            state.selectedMenu = action.payload
            state.status = "idle"
        },
        setServices: (state, action) => {
            state.services = action.payload
            state.status = "idle"
        },
        setSelectedService: (state, action) => {
            state.selectedService = action.payload
            state.status = "idle"
        },
    },
})

// Action creators are generated for each case reducer function
export const { setBranch, addBranches, addBranch, setLoading, setBranches,
    setSelectedBranches, setMenu, setServices, setSelectedMenu, setSelectedService } = serviceSlice.actions

export default serviceSlice.reducer

export interface branchesType {
    id: string;
    branchImage: string;
    enabled: boolean;
    branchName: string;
    city: string;
    index: number;
    address: string;
    Longitude: string;
    Latitude: string;
    status: string;
}

export interface menuType {
    branchId: string,
    id: string,
    img: string,
    index: number,
    menuName: string,
    status: string,
    timings: {
        day: string,
        from: any,
        to: any
    }[]
}

export interface serviceType {
    id: string,
    branchId: string,
    menuId: string,
    description: string,
    estimatedTime: string,
    serviceImage: string,
    serviceName: string,
    price: string,
    index: number,
    status: string,
    options: {
        id: string,
        title: string,
        maxallow: string,
        innerOptions: {
            id: string,
            name: string,
            price: string,
            title: string,
        }[]
    }[],
    recommended: {
        id: string,
        serviceName: string,
        serviceImage: string,
        description: string,
        estimatredTime: string,
    }[]
}