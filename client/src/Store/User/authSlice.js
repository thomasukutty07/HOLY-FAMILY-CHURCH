import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isAuthenticated: false,
    user: null,
    loading: false,
};

export const loginUser = createAsyncThunk("auth/login", async (formData, thunkAPI) => {
    try {
        const response = await axios.post(`http://localhost:4000/church/auth/login`, formData, {
            withCredentials: true,
        });
        return response?.data;
    } catch (error) {
        console.log("Login error:", error.message);
        return thunkAPI.rejectWithValue(error.response?.data || "Login failed");
    }
});

export const logoutUser = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
    try {
        const response = await axios.post(`http://localhost:4000/church/auth/logout`, {}, {
            withCredentials: true,
        });
        return response?.data;
    } catch (error) {
        console.error("Logout error:", error.message);
        return thunkAPI.rejectWithValue(error.response?.data || "Logout failed");
    }
});

export const checkAuth = createAsyncThunk("auth/checkAuth", async (_, thunkAPI) => {
    try {
        const response = await axios.get(`http://localhost:4000/church/auth/check-auth`, {
            withCredentials: true,
            headers: {
                "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
            },
        });
        return response?.data;
    } catch (error) {
        console.error("Auth check error:", error.message);
        return thunkAPI.rejectWithValue(error.response?.data || "Auth check failed");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = action.payload?.success || false;
                state.user = action.payload?.user || null;
            })
            .addCase(loginUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })

            // Check Auth
            .addCase(checkAuth.pending, (state) => {
                state.loading = true;
            })
            .addCase(checkAuth.fulfilled, (state, action) => {
                state.loading = false;
                state.isAuthenticated = action.payload?.success || false;
                state.user = action.payload?.user || null;
            })
            .addCase(checkAuth.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })

            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            });
    },
});

export default authSlice.reducer;
