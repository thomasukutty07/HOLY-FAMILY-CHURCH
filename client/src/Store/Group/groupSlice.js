import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    groupNames: [],
    familyNames: [],
    groupData: null,
    loading: false,
}

export const createGroup = createAsyncThunk("group/create", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:4000/church/groups", data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" })
    }
})

export const deleteGroup = createAsyncThunk("group/delete", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`http://localhost:4000/church/groups/delete/${id}`)
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" })
    }
})

export const deleteGroupImage = createAsyncThunk("group/delete-image", async (id, { rejectWithValue }) => {
    try {
        const imageId = id.replace(/^church\//, "");
        const response = await axios.delete(`http://localhost:4000/church/groups/delete-image/${imageId}`)
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" })
    }
})

export const uploadGroupImage = createAsyncThunk("group/upload-image", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:4000/church/groups/upload-image", data)
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" })
    }
})

export const fetchFamilyByGroupName = createAsyncThunk("group/fetchGroupsWithFamily", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.get("http://localhost:4000/church/groups/names/grouped")
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" })
    }
})

const groupSlice = createSlice({
    name: "group",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFamilyByGroupName.pending, (state) => {
                state.loading = true
            })
            .addCase(fetchFamilyByGroupName.fulfilled, (state, action) => {
                state.loading = false;

                // Store the full response in groupData
                state.groupData = action.payload.data

                // Store only group data (excluding familyName)
                state.groupNames = action.payload.data.map(group => {
                    const { families, ...groupInfo } = group; // Destructure to exclude families
                    return groupInfo; // Return only group-level properties, excluding families
                })

                // Store full familyName data (keep group field)
                state.familyNames = action.payload.data.reduce((acc, group) => {
                    group.families.forEach(family => {
                        acc.push(family); // Keep the full family object with the group field
                    });
                    return acc;
                }, []);
            })
            .addCase(fetchFamilyByGroupName.rejected, (state) => {
                state.loading = false
                state.familyNames = [] // Reset familyName state on failure
                state.groupNames = [] // Reset group state on failure
                state.groupData = null // Reset groupData on failure
            })
    }
})

export default groupSlice.reducer;
