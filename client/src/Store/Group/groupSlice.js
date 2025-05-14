import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    groupNames: [],
    groupData: null,
    familyLoading: false,
}

export const createGroup = createAsyncThunk("group/create", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:4000/church/groups/create-group", data, {
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

export const fetchAllGroupNames = createAsyncThunk("group/fetchGroupsWithFamily", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.get("http://localhost:4000/church/groups")
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
        builder.addCase(fetchAllGroupNames.pending, (state) => {
            state.groupNames = []
            state.familyLoading = true
        }).addCase(fetchAllGroupNames.fulfilled, (state, action) => {
            state.groupNames = action.payload.groups
            state.familyLoading = false
        }).addCase(fetchAllGroupNames.rejected, (state) => {
            state.groupNames = []
            state.familyLoading = false
        })
    }
})

export default groupSlice.reducer;
