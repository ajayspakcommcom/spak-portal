// dataSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios, { Axios } from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// Define your state type
interface DataState {
    data: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string;
    token: string;
}

// Define an initial state
const initialState: DataState = {
    data: null,
    status: 'idle',
    error: '',
    token: ''
};

// Define your async thunk function
export const postLogin = createAsyncThunk('post/postLogin', async (data: { username: string, password: string }) => {

    console.log(`${publicRuntimeConfig.API_URL}auth`);


    const config = {
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer YOUR_TOKEN_HERE'
        },
    };

    const response = await axios.post(`${publicRuntimeConfig.API_URL}auth`, JSON.stringify(data), config);
    return response;
});


export const getAdminUserById = createAsyncThunk('get/getAdminUserById',
    async (data) => {
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer YOUR_TOKEN_HERE'
            }
        };

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/SDASD`, config);
        return response;
    }
);

// Create a slice
const authAdminSlice = createSlice({
    name: 'adminAuth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            //state.data.token = action.payload;
        },
        logout: (state) => {
            console.log('logout');
            // state.token = '';
            // state.data = '';
            // localStorage.removeItem('jwtToken');
            // localStorage.removeItem('userData');
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(postLogin.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(postLogin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.token = action.payload.data.token;
                state.data = action.payload.data.user;
                localStorage.setItem('jwtToken', state.token);
                localStorage.setItem('userData', JSON.stringify(state.data));
            })
            .addCase(postLogin.rejected, (state, action) => {
                state.status = 'failed';
                state.token = '';
                state.data = '';
            });
    },
});

export const { setToken, logout } = authAdminSlice.actions;
export default authAdminSlice.reducer;
