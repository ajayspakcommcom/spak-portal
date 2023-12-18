// dataSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// Define your state type
interface DataState {
    data: any | null;
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string
}

// Define an initial state
const initialState: DataState = {
    data: null,
    status: 'idle',
    error: ''
};

// Define your async thunk function
export const getTask = createAsyncThunk('get/getTasks', async (token: string) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
    };

    const response = await axios.get(`${publicRuntimeConfig.API_URL}task`, config);
    return response;
});

export const postTask = createAsyncThunk('post/postTask', async (data: { clientName: string, taskName: string, taskDescription: string, startDate: Date | null, endDate: Date | null, status: string, deadLine: string, token: string }) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.token}`
        },
    };

    console.log(data);
    console.log(`${publicRuntimeConfig.API_URL}task`);


    const response = await axios.post(`${publicRuntimeConfig.API_URL}task`, JSON.stringify(data), config);
    return response;
});

// Create a slice
const taskAdminSlice = createSlice({
    name: 'adminTask',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string>) => {
            //state.data.token = action.payload;
        },
        logout: (state) => {
            state.data = '';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTask.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(getTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
            })
            .addCase(getTask.rejected, (state, action) => {
                state.status = 'failed';
            })
            // Task Post
            .addCase(postTask.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(postTask.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload.data.user;
            })
            .addCase(postTask.rejected, (state, action) => {
                state.status = 'failed';
                state.data = '';
            });
    },
});

export const { setToken, logout } = taskAdminSlice.actions;
export default taskAdminSlice.reducer;
