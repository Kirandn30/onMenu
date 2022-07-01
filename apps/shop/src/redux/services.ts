import { createSlice } from '@reduxjs/toolkit'

export interface serviceState {
    branches: branchesType[]
    status: string
    loading: boolean
    selectedBranch: branchesType | null
}

const initialState: serviceState = {
    branches: [],
    status: "loading",
    loading: false,
    selectedBranch: null,

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
        }

    },
})

// Action creators are generated for each case reducer function
export const { setBranch, addBranches, addBranch, setLoading, setSelectedBranches } = serviceSlice.actions

export default serviceSlice.reducer

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