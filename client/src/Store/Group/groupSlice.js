import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    groupNames: [],
    groupData: null,
    familyLoading: false,
    imageLoading: false,
}

export const createGroup = createAsyncThunk("group/create", async (data, { rejectWithValue }) => {
    try {
        // Convert FormData to JSON object
        const jsonData = {};
        data.forEach((value, key) => {
            jsonData[key] = value;
        });

        const response = await axios.post(
            "http://localhost:4000/church/groups/create-group", 
            jsonData,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error creating group:", error);
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" });
    }
})

export const deleteGroup = createAsyncThunk("group/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(
            `http://localhost:4000/church/groups/delete/${id}`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error deleting group:", error);
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" });
    }
})

export const deleteGroupImage = createAsyncThunk("group/delete-image", async (id, { rejectWithValue }) => {
    try {
        const imageId = id.replace(/^church\//, "");
        const response = await axios.delete(
            `http://localhost:4000/church/groups/delete-image/${imageId}`,
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error deleting group image:", error);
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" });
    }
})

export const uploadGroupImage = createAsyncThunk("group/upload-image", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            "http://localhost:4000/church/groups/upload-image", 
            data,
            {
                withCredentials: true,
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error uploading group image:", error);
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" });
    }
})

export const fetchAllGroupNames = createAsyncThunk("group/fetchGroupsWithFamily", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(
            "http://localhost:4000/church/groups",
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error fetching groups:", error);
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" });
    }
})

export const updateGroup = createAsyncThunk("group/update", async ({ id, groupData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(
            `http://localhost:4000/church/groups/update/${id}`, 
            groupData, 
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
        console.error("Error updating group:", error);
        return rejectWithValue(error?.response?.data || { 
            success: false, 
            message: "Failed to update group" 
        });
    }
});

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllGroupNames.pending, (state) => {
                state.groupNames = [];
                state.familyLoading = true;
            })
            .addCase(fetchAllGroupNames.fulfilled, (state, action) => {
                state.groupNames = action.payload.groups;
                state.familyLoading = false;
            })
            .addCase(fetchAllGroupNames.rejected, (state) => {
                state.groupNames = [];
                state.familyLoading = false;
            })
            .addCase(uploadGroupImage.pending, (state) => {
                state.imageLoading = true;
            })
            .addCase(uploadGroupImage.fulfilled, (state) => {
                state.imageLoading = false;
            })
            .addCase(uploadGroupImage.rejected, (state) => {
                state.imageLoading = false;
            })
            .addCase(updateGroup.pending, (state) => {
                state.familyLoading = true;
            })
            .addCase(updateGroup.fulfilled, (state, action) => {
                state.familyLoading = false;
                if (action.payload.success && action.payload.group) {
                    const index = state.groupNames.findIndex(group => group._id === action.payload.group._id);
                    if (index !== -1) {
                        state.groupNames[index] = action.payload.group;
                    }
                }
            })
            .addCase(updateGroup.rejected, (state, action) => {
                state.familyLoading = false;
                console.error("Update group rejected:", action.payload);
            })
            .addCase(createGroup.fulfilled, (state, action) => {
                if (action.payload.group) {
                    state.groupNames.push(action.payload.group);
                }
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                if (action.payload.group) {
                    state.groupNames = state.groupNames.filter(
                        group => group._id !== action.payload.group._id
                    );
                }
            });
    }
})

export default groupSlice.reducer;
