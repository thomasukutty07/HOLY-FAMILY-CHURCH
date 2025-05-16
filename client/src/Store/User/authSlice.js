import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null
};

const API_BASE_URL = "http://localhost:4000/church/auth";

const handleAsyncThunk = async (endpoint, method = "get", data = null, thunkAPI) => {
    try {
        console.log('Making request to:', `${API_BASE_URL}/${endpoint}`);
        console.log('Request data:', data);
        
        const config = {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json",
            },
        };

        let response;
        if (method === "get") {
            response = await axios.get(`${API_BASE_URL}/${endpoint}`, config);
        } else {
            response = await axios.post(`${API_BASE_URL}/${endpoint}`, data, config);
        }

        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Request failed:', error);
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        
        const errorMessage = error.response?.data?.message || error.message || `${endpoint} failed`;
        return thunkAPI.rejectWithValue({ message: errorMessage });
    }
};

export const loginUser = createAsyncThunk(
    "auth/login",
    (formData, thunkAPI) => handleAsyncThunk("login", "post", formData, thunkAPI)
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    (_, thunkAPI) => handleAsyncThunk("logout", "post", {}, thunkAPI)
);

export const checkAuth = createAsyncThunk(
    "auth/checkAuth",
    (_, thunkAPI) => handleAsyncThunk("check-auth", "get", null, thunkAPI)
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        const handlePending = (state) => {
            state.loading = true;
            state.error = null;
        };

        const handleFulfilled = (state, action) => {
            console.log('Action fulfilled:', action);
            state.loading = false;
            state.isAuthenticated = action.payload?.success || false;
            state.user = action.payload?.user || null;
            state.error = null;
        };

        const handleRejected = (state, action) => {
            console.log('Action rejected:', action);
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload?.message || "An error occurred";
        };

        builder
            .addCase(loginUser.pending, handlePending)
            .addCase(loginUser.fulfilled, handleFulfilled)
            .addCase(loginUser.rejected, handleRejected)
            .addCase(checkAuth.pending, handlePending)
            .addCase(checkAuth.fulfilled, handleFulfilled)
            .addCase(checkAuth.rejected, handleRejected)
            .addCase(logoutUser.fulfilled, handleRejected)
            .addCase(logoutUser.rejected, handleRejected);
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
