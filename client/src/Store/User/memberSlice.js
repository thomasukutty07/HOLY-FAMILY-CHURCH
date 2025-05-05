import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    members: [],
    memberLoading: false,
};


export const uploadMemberImage = createAsyncThunk(
    "admin/uploadMemberImage",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:4000/church/admin/members/upload-image",
                data
            );
            return response?.data;
        } catch (error) {
            console.error(error.message);
            return rejectWithValue(error.response?.data || { message: "Something went wrong" });
        }
    }
);


export const createMember = createAsyncThunk(
    "admin/createMember",
    async (formData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:4000/church/admin/members",
                formData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response?.data;
        } catch (error) {
            console.error("Error while creating member:", error.message);
            return rejectWithValue(error.response?.data || { message: "Something went wrong" });
        }
    }
);


export const deleteMemberImage = createAsyncThunk(
    "admin/deleteMemberImage", 
    async (id, { rejectWithValue }) => {
        try {
            const imageId = id.replace(/^church\//, ""); 
            const response = await axios.delete(
                `http://localhost:4000/church/admin/member/delete-image/${imageId}`
            );
            return response?.data;
        } catch (error) {
            console.error(error.message);
            return rejectWithValue(
                error.response?.data || { message: "Failed to delete image" } // 🔧 more accurate error message
            );
        }
    }
);

export const fetchAllMembers = createAsyncThunk(
    "admin/fetchAllMembers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "http://localhost:4000/church/admin/members"
            );
            return response?.data;
        } catch (error) {
            console.error(error.message);
            return rejectWithValue(error.response?.data || { message: "Failed to fetch members" });
        }
    }
);


export const updateMember = createAsyncThunk(
    "admin/updateMember",
    async (memberData, { rejectWithValue }) => {
        try {
            const response = await axios.put(
                `http://localhost:4000/church/admin/members/${memberData.id}`,
                memberData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            return response?.data;
        } catch (error) {
            console.error("Error while updating member:", error.message);
            return rejectWithValue(error.response?.data || { message: "Failed to update member" });
        }
    }
);

export const deleteMember = createAsyncThunk(
    "admin/deleteMember",
    async (memberId, { rejectWithValue }) => {
        try {
            await axios.delete(`http://localhost:4000/church/admin/members/${memberId}`);
            return { memberId };
        } catch (error) {
            console.error("Error while deleting member:", error.message);
            return rejectWithValue(error.response?.data || { message: "Failed to delete member" });
        }
    }
);

const memberSlice = createSlice({
    name: "member",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllMembers.pending, (state) => {
                state.memberLoading = true;
                state.members = null;
            })
            .addCase(fetchAllMembers.fulfilled, (state, action) => {
                state.memberLoading = false;
                state.members = action.payload.members;
            })
            .addCase(fetchAllMembers.rejected, (state) => {
                state.memberLoading = false;
                state.members = null;
            })
            .addCase(updateMember.fulfilled, (state, action) => {
                const updatedMember = action.payload.user;
                const index = state.members.findIndex((m) => m.id === updatedMember.id);
                if (index !== -1) {
                    state.members[index] = updatedMember;
                }
            })
            .addCase(deleteMember.fulfilled, (state, action) => {
                const { memberId } = action.payload;
                state.members = state.members.filter((m) => m.id !== memberId);
            });
    },
});

export default memberSlice.reducer;
