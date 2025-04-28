import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    users: [],
    userLoading: false,
};

// Upload image to Cloudinary
export const uploadUserImage = createAsyncThunk(
    "admin/upload-image",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:4000/church/admin/upload-image",
                data
            );
            return response?.data;
        } catch (error) {
            console.error(error.message);
            return rejectWithValue(error.response?.data || { message: "Something went wrong" });
        }
    }
);

// Creating user
export const createUser = createAsyncThunk(
    "admin/addUser",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:4000/church/admin/add-user",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
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

// Fetching All users
export const fetchAllUsers = createAsyncThunk(
    "admin/fetchingAllUsers",
    async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/church/admin/fetch-users"
            );
            return response?.data;
        } catch (error) {
            console.error(error.message);
            console.log("Error while fetching users");
        }
    }
);

// Update user
export const updateUser = createAsyncThunk(
    "admin/updateUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `http://localhost:4000/church/admin/update-user/${userData.id}`,
                userData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
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
            const response = await axios.delete(
                `http://localhost:4000/church/admin/delete-user/${userId}`
            );
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
            // Fetch users
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.users = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.users;
            })
            .addCase(fetchAllUsers.rejected, (state) => {
                state.loading = false;
                state.users = null;
            })
            // Update user
            .addCase(updateUser.fulfilled, (state, action) => {
                const updatedUser = action.payload.user;
                const index = state.users.findIndex((user) => user.id === updatedUser.id);
                if (index !== -1) {
                    state.users[index] = updatedUser; // Update the existing user with the new data
                }
            })

            // Delete user
            .addCase(deleteUser.fulfilled, (state, action) => {
                const { userId } = action.payload;
                state.users = state.users.filter((user) => user.id !== userId); // Remove the deleted user from the list
            });
    },
});

export default userSlice.reducer;
