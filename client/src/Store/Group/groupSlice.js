import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    groupNames: [],
    groupLoading: false
}

export const fetchAllGroupNames = createAsyncThunk("groupNames", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("http://localhost:4000/church/group/fetch-groups")
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error?.response?.data || { message: "Something went wrong" })
    }
})
export const createGroup = createAsyncThunk("createGroup", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:4000/church/group/create-group", data, {
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
export const uploadGroupImage = createAsyncThunk("createGroup", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post("http://localhost:4000/church/group/upload-group-image", data)
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
            state.groupNames = null
            state.groupLoading = true
        })
        builder.addCase(fetchAllGroupNames.fulfilled, (state, action) => {
            state.groupNames = action?.payload?.success ? action?.payload?.data : null
            state.groupLoading = false
        })
        builder.addCase(fetchAllGroupNames.rejected, (state) => {
            state.groupNames = null
            state.groupLoading = false
        })
    }

})

export default groupSlice.reducer