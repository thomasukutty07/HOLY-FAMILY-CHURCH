import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { MEMBERS_API } from '../../config/api';

const initialState = {
    members: [],
    groupedFamilyMembers: [],
    imageLoading: false,
    memberLoading: false,
    error: null,
};


export const uploadMemberImage = createAsyncThunk(
    "admin/uploadMemberImage",
    async (data, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                `${MEMBERS_API}/upload-image`,
                data,
                {
                    withCredentials: true,
                }
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
                `${MEMBERS_API}/members`,
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            if (!response.data.success) {
                return rejectWithValue(response.data);
            }
            return response.data;
        } catch (error) {
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
                `${MEMBERS_API}/delete-image/${imageId}`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            
            if (!response.data.success) {
                return rejectWithValue(response.data);
            }
            
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || { message: "Failed to delete image" }
            );
        }
    }
);

export const fetchAllMembers = createAsyncThunk(
    "admin/fetchAllMembers",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                MEMBERS_API,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            return response?.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to fetch members" });
        }
    }
);
export const fetchFamilyWithMembers = createAsyncThunk(
    "admin/family/members",
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${MEMBERS_API}/${id}/members`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
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
                `${MEMBERS_API}/members/update/${memberData.id}`,
                memberData,
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            if (!response.data.success) {
                return rejectWithValue(response.data);
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || { message: "Failed to update member" });
        }
    }
);

export const deleteMember = createAsyncThunk(
    "admin/deleteMember",
    async (memberId, { rejectWithValue }) => {
        try {
            const response = await axios.delete(
                `${MEMBERS_API}/members/${memberId}`,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );
            return response?.data;
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
            .addCase(uploadMemberImage.pending, (state) => {
                state.imageLoading = true;
            })
            .addCase(uploadMemberImage.fulfilled, (state) => {
                state.imageLoading = false;
            })
            .addCase(uploadMemberImage.rejected, (state) => {
                state.imageLoading = false;
            })
            .addCase(deleteMemberImage.pending, (state) => {
                state.imageLoading = true;
            })
            .addCase(deleteMemberImage.fulfilled, (state) => {
                state.imageLoading = false;
            })
            .addCase(deleteMemberImage.rejected, (state) => {
                state.imageLoading = false;
            })
            .addCase(createMember.pending, (state) => {
                state.memberLoading = true;
            })
            .addCase(createMember.fulfilled, (state) => {
                state.memberLoading = false;
            })
            .addCase(createMember.rejected, (state) => {
                state.memberLoading = false;
            })
            .addCase(updateMember.pending, (state) => {
                state.memberLoading = true;
            })
            .addCase(updateMember.fulfilled, (state) => {
                state.memberLoading = false;
            })
            .addCase(updateMember.rejected, (state) => {
                state.memberLoading = false;
            })
            .addCase(deleteMember.pending, (state) => {
                state.memberLoading = true;
            })
            .addCase(deleteMember.fulfilled, (state) => {
                state.memberLoading = false;
            })
            .addCase(deleteMember.rejected, (state) => {
                state.memberLoading = false;
            })
            .addCase(fetchFamilyWithMembers.pending, (state) => {
                state.memberLoading = true;
                state.groupedFamilyMembers = [];
            })
            .addCase(fetchFamilyWithMembers.fulfilled, (state, action) => {
                state.memberLoading = false;
                state.groupedFamilyMembers = action.payload.members;
            })
            .addCase(fetchFamilyWithMembers.rejected, (state) => {
                state.memberLoading = false;
                state.groupedFamilyMembers = [];
            })
    },
});

export default memberSlice.reducer;
