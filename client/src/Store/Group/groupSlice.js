import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    groupNames: [],
    groupLoading: false,
}
export const fetchAllGroupNames = createAsyncThunk("group/fetch-all", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("http://localhost:4000/church/group/groups")
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" })
    }
})

export const createGroup = createAsyncThunk("group/create", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:4000/church/group/groups", data, {
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
export const uploadGroupImage = createAsyncThunk("group/upload-image", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:4000/church/group/groups/upload-image", data)
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
            .addCase(fetchAllGroupNames.pending, (state) => {
                state.groupLoading = true
                state.groupNames = []
            })
            .addCase(fetchAllGroupNames.fulfilled, (state, action) => {
                state.groupNames = action?.payload?.success ? action?.payload?.data : []
                state.groupLoading = false
            })
            .addCase(fetchAllGroupNames.rejected, (state, action) => {
                state.groupLoading = false
                state.groupNames = []
            })
    }
})

export default groupSlice.reducer
