import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  events: [],
  loading: false,
  error: null,
};

const API_BASE_URL = "http://localhost:4000/church/calendar";

const handleAsyncThunk = async (endpoint, method = "get", data = null, thunkAPI) => {
  try {
    console.log(`Making ${method.toUpperCase()} request to:`, `${API_BASE_URL}/${endpoint}`);
    
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    let response;
    if (method === "get") {
      response = await axios.get(`${API_BASE_URL}/${endpoint}`, config);
    } else if (method === "delete") {
      console.log("Making delete request with config:", config);
      response = await axios.delete(`${API_BASE_URL}/${endpoint}`, config);
    } else {
      response = await axios[method](`${API_BASE_URL}/${endpoint}`, data, config);
    }

    console.log(`${method.toUpperCase()} response:`, response?.data);
    return response?.data;
  } catch (error) {
    console.error(`Error in ${method} request:`, error);
    console.error("Error response:", error.response?.data);
    console.error("Error status:", error.response?.status);
    return thunkAPI.rejectWithValue(error.response?.data || `${endpoint} failed`);
  }
};

export const fetchEvents = createAsyncThunk(
  "calendar/fetchEvents",
  (_, thunkAPI) => handleAsyncThunk("events", "get", null, thunkAPI)
);

export const addEvent = createAsyncThunk(
  "calendar/addEvent",
  (eventData, thunkAPI) => handleAsyncThunk("events", "post", eventData, thunkAPI)
);

export const updateEvent = createAsyncThunk(
  "calendar/updateEvent",
  ({ id, eventData }, thunkAPI) => handleAsyncThunk(`events/${id}`, "put", eventData, thunkAPI)
);

export const deleteEvent = createAsyncThunk(
  "calendar/deleteEvent",
  (id, thunkAPI) => handleAsyncThunk(`events/${id}`, "delete", null, thunkAPI)
);

const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handlePending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.error = null;
    };

    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "An error occurred";
    };

    builder
      .addCase(fetchEvents.pending, handlePending)
      .addCase(fetchEvents.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        console.log('Fetched events in reducer:', action.payload?.events);
        state.events = action.payload?.events || [];
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        handleRejected(state, action);
        console.error('Error fetching events:', action.payload);
      })

      .addCase(addEvent.pending, handlePending)
      .addCase(addEvent.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.events.push(action.payload?.event);
      })
      .addCase(addEvent.rejected, handleRejected)

      .addCase(updateEvent.pending, handlePending)
      .addCase(updateEvent.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        const index = state.events.findIndex(event => event._id === action.payload?.event._id);
        if (index !== -1) {
          state.events[index] = action.payload?.event;
        }
      })
      .addCase(updateEvent.rejected, handleRejected)

      .addCase(deleteEvent.pending, handlePending)
      .addCase(deleteEvent.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.events = state.events.filter(event => event._id !== action.payload?.eventId);
      })
      .addCase(deleteEvent.rejected, handleRejected);
  },
});

export default calendarSlice.reducer; 