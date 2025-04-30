import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    users: [],
    userLoading: false,
};

// Upload user image
export const uploadUserImage = createAsyncThunk(
    "admin/uploadUserImage",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:4000/church/admin/users/upload-image",
                data
            );
            return response?.data;
        } catch (error) {
            console.error(error.message);
            return rejectWithValue(error.response?.data || { message: "Something went wrong" });
        }
    }
);

// Create user
export const createUser = createAsyncThunk(
    "admin/createUser",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:4000/church/admin/users",
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response?.data;
        } catch (error) {
            console.error("Error while creating user:", error.message);
            return rejectWithValue(error.response?.data || { message: "Something went wrong" });
        }
    }
);

// Fetch all users
export const fetchAllUsers = createAsyncThunk(
    "admin/fetchAllUsers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "http://localhost:4000/church/admin/users"
            );
            return response?.data;
        } catch (error) {
            console.error(error.message);
            return rejectWithValue(error.response?.data || { message: "Failed to fetch users" });
        }
    }
);

// Update user
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `http://localhost:4000/church/admin/users/${userData.id}`,
                userData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response?.data;
        } catch (error) {
            console.error("Error while updating user:", error.message);
            return rejectWithValue(error.response?.data || { message: "Failed to update user" });
        }
    }
);

// Delete user
export const deleteUser = createAsyncThunk(
    "admin/deleteUser",
    async (userId, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost:4000/church/admin/users/${userId}`);
            return { userId };
        } catch (error) {
            console.error("Error while deleting user:", error.message);
            return rejectWithValue(error.response?.data || { message: "Failed to delete user" });
        }
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.userLoading = true;
                state.users = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.userLoading = false;
                state.users = action.payload.users;
            })
            .addCase(fetchAllUsers.rejected, (state) => {
                state.userLoading = false;
                state.users = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload.user;
                const index = state.users.findIndex((user) => user.id === updatedUser.id);
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                const { userId } = action.payload;
                state.users = state.users.filter((user) => user.id !== userId);
            });
    },
});

export default userSlice.reducer;
