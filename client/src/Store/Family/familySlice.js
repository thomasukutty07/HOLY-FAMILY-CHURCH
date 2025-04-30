import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const uploadFamilyImage = createAsyncThunk("family/upload-image", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:4000/church/family/upload-image', data)
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error.response?.data || { message: "Something went wrong" })
    }
})

export const createFamily = createAsyncThunk("family/create", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:4000/church/family', data, {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error.response?.data || { message: "Something went wrong" })
    }
})

export const fetchAllFamilyNames = createAsyncThunk("family/fetch-all", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get('http://localhost:4000/church/family/families/names', {
            headers: {
                "Content-Type": "application/json"
            }
        })
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error.response?.data || { message: "Something went wrong" })
    }
})

const initialState = {
    familyNames: [],
    familyLoading: false,
}

const familySlice = createSlice({
    name: "family",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFamilyNames.pending, (state) => {
                state.familyLoading = true
            })
            .addCase(fetchAllFamilyNames.fulfilled, (state, action) => {
                state.familyNames = action.payload?.familyNames
                state.familyLoading = false
            })
            .addCase(fetchAllFamilyNames.rejected, (state, action) => {
                state.familyNames = []
                state.familyLoading = false
            })
    }
})

export default familySlice.reducer
