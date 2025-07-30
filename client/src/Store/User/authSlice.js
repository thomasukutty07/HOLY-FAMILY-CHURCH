import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Load initial state from localStorage
const loadInitialState = () => {
    try {
        const persistedState = localStorage.getItem('authState');
        if (persistedState) {
            const parsedState = JSON.parse(persistedState);
            return {
                ...parsedState,
                loading: false,
                error: null
            };
        }
    } catch (error) {
        console.error('Error loading persisted auth state:', error);
    }
    return {
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
    };
};

const initialState = loadInitialState();

const API_BASE_URL = "http://localhost:4000/church/auth";

const handleAsyncThunk = async (endpoint, method = "get", data = null, thunkAPI) => {
    try {
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

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || `${endpoint} failed`;
        return thunkAPI.rejectWithValue({ message: errorMessage });
    }
};

export const loginUser = createAsyncThunk(
    "auth/login",
    (data, thunkAPI) => handleAsyncThunk("login", "post", data, thunkAPI)
);

export const checkAuth = createAsyncThunk(
    "auth/check",
    (_, thunkAPI) => handleAsyncThunk("check-auth", "get", null, thunkAPI)
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            // Clear client-side storage first
            localStorage.removeItem('authState');
            sessionStorage.clear();
            
            // Make the logout request with credentials
            const response = await axios.post(
                `${API_BASE_URL}/logout`,
                {},
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            
            // Clear any remaining cookies
            document.cookie.split(";").forEach(cookie => {
                const [name] = cookie.split("=");
                document.cookie = `${name.trim()}=;expires=${new Date(0).toUTCString()};path=/`;
            });
            
            return response.data;
        } catch (error) {
            // Even if the request fails, clear client state
            localStorage.removeItem('authState');
            sessionStorage.clear();
            document.cookie.split(";").forEach(cookie => {
                const [name] = cookie.split("=");
                document.cookie = `${name.trim()}=;expires=${new Date(0).toUTCString()};path=/`;
            });
            
            // If the server returned a 500 error but we cleared the state, consider it a success
            if (error.response?.status === 500) {
                return { success: true, message: "Logged out successfully" };
            }
            
            return thunkAPI.rejectWithValue(error.response?.data || { message: "Logout failed" });
        }
    }
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
            state.loading = false;
            state.isAuthenticated = action.payload?.success || false;
            state.user = action.payload?.user || null;
            state.error = null;
            
            // Persist state to localStorage
            if (action.payload?.success && action.payload?.user) {
                localStorage.setItem('authState', JSON.stringify({
                    isAuthenticated: true,
                    user: action.payload.user
                }));
            } else {
                localStorage.removeItem('authState');
            }
        };

        const handleRejected = (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload?.message || "An error occurred";
            localStorage.removeItem('authState');
        };

        builder
            .addCase(loginUser.pending, handlePending)
            .addCase(loginUser.fulfilled, handleFulfilled)
            .addCase(loginUser.rejected, handleRejected)
            .addCase(checkAuth.pending, handlePending)
            .addCase(checkAuth.fulfilled, handleFulfilled)
            .addCase(checkAuth.rejected, handleRejected)
            .addCase(logoutUser.pending, handlePending)
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('authState');
            })
            .addCase(logoutUser.rejected, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
                state.error = null;
                localStorage.removeItem('authState');
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
