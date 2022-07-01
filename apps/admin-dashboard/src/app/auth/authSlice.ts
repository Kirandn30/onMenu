import { createSlice } from '@reduxjs/toolkit';
import { User } from 'firebase/auth';
import { RootState } from '../Reduxstore/store';

type stateProps = {
    user: User | null
    loading: boolean
}

const initialState: stateProps = {
    user: null,
    loading: true
};


export const authSlice = createSlice({
    name: 'auth',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.loading = false
        },

    },

});

export const { setUser } = authSlice.actions;

// export const selectAuth = (state: RootState) => state.auth;

export default authSlice.reducer;