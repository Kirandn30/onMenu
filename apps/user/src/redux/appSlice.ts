import { createSlice } from "@reduxjs/toolkit"

export interface appState {
    loading: boolean;
    selectedShopId: string;
    branches: branchesType[];
    selectedBranch: branchesType | null;
    menu: menuType[];
    selectedMenu: menuType | null;
    services: serviceType[];
    selectedService: serviceType | null;
    cart: any[];
    selectedOptions: any[]
}

const initialState: appState = {
    loading: true,
    selectedShopId: "",
    branches: [],
    selectedBranch: null,
    menu: [],
    selectedMenu: null,
    services: [],
    selectedService: null,
    cart: [],
    selectedOptions: []
}

export const appSlice = createSlice({
    name: 'appSlice',
    initialState,
    reducers: {
        setLoading: (state, action) => {
            state.loading = action.payload
        },
        setShopId: (state, action) => {
            state.selectedShopId = action.payload
        },
        setBranches: (state, action) => {
            state.branches = action.payload
        },
        setSelectedBranch: (state, action) => {
            state.selectedBranch = action.payload
        },
        setMenu: (state, action) => {
            state.menu = action.payload
        },
        setSelectedMenu: (state, action) => {
            state.selectedMenu = action.payload
        },
        setServices: (state, action) => {
            state.services = action.payload
        },
        setSelectedService: (state, action) => {
            state.selectedService = action.payload
        },
        addToCart: (state, action) => {
            state.cart = action.payload
        },
        setSelectedOptions: (state, action) => {
            state.selectedOptions = action.payload
        }
    }

})

export const { setLoading, setShopId, setBranches,
    setSelectedBranch, setMenu, setSelectedMenu,
    setServices, setSelectedService, addToCart, setSelectedOptions } = appSlice.actions

export default appSlice.reducer

export interface branchesType {
    id: string;
    enabled: boolean;
    branchName: string;
    city: string;
    index: number;
    address: string;
    longitude: string;
    latitude: string;
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
        price: string,
    }[]
}

// export interface optionsType {
//     id: string,
//     title: string,
//     maxallow: string,
//     index: number,
//     innerOptions: {
//         id: string,
//         name: string,
//         price: string,
//         title: string,
//         index: number,
//     }[]
// }[]