import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "axios"

export const uploadFamilyImage = createAsyncThunk("family/upload-image", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post(
            "http://localhost:4000/church/families/upload-image",
            data,
            {
                withCredentials: true,
            }
        );
        return response?.data;
    } catch (error) {
        console.error("Error uploading family image:", error);
        return rejectWithValue(error?.response?.data || { message: "Failed to upload image" });
    }
})

export const updateFamily = createAsyncThunk("family/update", async ({ id, familyData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`http://localhost:4000/church/families/update/${id}`, familyData, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error.response?.data || { message: "Something went wrong" })
    }
})

export const createFamily = createAsyncThunk("family/create", async (data, { rejectWithValue }) => {
    try {
        const response = await axios.post('http://localhost:4000/church/families/create-family', data, {
            headers: {
                "Content-Type": "application/json"
            },
            withCredentials: true
        })
        return response?.data
    } catch (error) {
        console.error(error.message)
        return rejectWithValue(error.response?.data || { message: "Something went wrong" })
    }
})

export const fetchAllFamily = createAsyncThunk("All/families", async (_, { rejectWithValue }) => {
    try {
        console.log("Fetching all families...");
        const response = await axios.get('http://localhost:4000/church/families', {
            withCredentials: true,
            headers: {
                "Content-Type": "application/json"
            }
        });
        console.log("Family response:", response.data);
        return response?.data;
    } catch (error) {
        console.error("Error fetching families:", error);
        return rejectWithValue(error.response?.data || { message: "Something went wrong" });
    }
})

export const fetchFamilyWithGroup = createAsyncThunk("group/familes", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.get(`http://localhost:4000/church/families/${id}/families`, {
            withCredentials: true,
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
        const response = await axios.delete(`http://localhost:4000/church/families/delete-image/${imageId}`, {
            withCredentials: true,
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

export const deleteFamily = createAsyncThunk("family/deleteFamily", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`http://localhost:4000/church/families/delete/${id}`, {
            withCredentials: true,
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
    groupedFamilyNames: [],
    imageLoading: false,
    familyLoading: false,
}

const familySlice = createSlice({
    name: "family",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFamily.pending, (state) => {
                state.familyNames = [];
                state.familyLoading = true;
            })
            .addCase(fetchAllFamily.fulfilled, (state, action) => {
                console.log("Setting family names:", action.payload.families);
                state.familyLoading = false;
                state.familyNames = action.payload.families;
            })
            .addCase(fetchAllFamily.rejected, (state) => {
                state.familyLoading = false;
                state.familyNames = [];
            });
        builder.addCase(uploadFamilyImage.pending, (state => {
            state.imageLoading = true
        })).addCase(uploadFamilyImage.fulfilled, (state, action) => {
            state.imageLoading = false
        }).addCase(uploadFamilyImage.rejected, (state) => {
            state.imageLoading = false
        })
            .addCase(fetchFamilyWithGroup.pending, (state => {
                state.groupedFamilyNames = []
                state.familyLoading = true
            })).addCase(fetchFamilyWithGroup.fulfilled, (state, action) => {
                state.familyLoading = false
                state.groupedFamilyNames = action.payload.data
            }).addCase(fetchFamilyWithGroup.rejected, (state) => {
                state.familyLoading = false,
                    state.groupedFamilyNames = []
            })
            .addCase(deleteFamily.pending, (state => {
                state.groupedFamilyNames = []
                state.familyLoading = true
            })).addCase(deleteFamily.fulfilled, (state) => {
                state.familyLoading = false
            }).addCase(deleteFamily.rejected, (state) => {
                state.familyLoading = false
            })
    }
})

export default familySlice.reducer
