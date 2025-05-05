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

export const deleteFamilyImage = createAsyncThunk("family/deleteFamilyImage", async (id, { rejectWithValue }) => {
    try {
        const imageId = id.replace(/^church\//, "");
        const response = await axios.delete(`http://localhost:4000/church/family/delete-image/${imageId}`,)
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error.response?.data || { message: "Something went wrong" })
    }
})

const initialState = {
    familyNames: [],
    groupedFamilyNames: [],
    familyLoading: false,
}

const familySlice = createSlice({
    name: "family",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
    }
})

export default familySlice.reducer
