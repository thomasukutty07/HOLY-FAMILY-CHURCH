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
    const config = {
      withCredentials: true,
      ...(method === "get" && {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }),
    };

    console.log(`Making ${method.toUpperCase()} request to ${API_BASE_URL}/${endpoint}`);
    
    const response = method === "get"
      ? await axios[method](`${API_BASE_URL}/${endpoint}`, config)
      : await axios[method](`${API_BASE_URL}/${endpoint}`, data, config);

    console.log('API Response:', response.data);
    return response?.data;
  } catch (error) {
    console.error('API Error:', error.response || error);
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
      console.error('Calendar slice error:', action.payload);
    };

    builder
      // Fetch Events
      .addCase(fetchEvents.pending, handlePending)
      .addCase(fetchEvents.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        console.log('Setting events in state:', action.payload?.events);
        state.events = action.payload?.events || [];
      })
      .addCase(fetchEvents.rejected, handleRejected)

      // Add Event
      .addCase(addEvent.pending, handlePending)
      .addCase(addEvent.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.events.push(action.payload?.event);
      })
      .addCase(addEvent.rejected, handleRejected)

      // Update Event
      .addCase(updateEvent.pending, handlePending)
      .addCase(updateEvent.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        const index = state.events.findIndex(event => event._id === action.payload?.event._id);
        if (index !== -1) {
          state.events[index] = action.payload?.event;
        }
      })
      .addCase(updateEvent.rejected, handleRejected)

      // Delete Event
      .addCase(deleteEvent.pending, handlePending)
      .addCase(deleteEvent.fulfilled, (state, action) => {
        handleFulfilled(state, action);
        state.events = state.events.filter(event => event._id !== action.payload?.eventId);
      })
      .addCase(deleteEvent.rejected, handleRejected);
  },
});

export default calendarSlice.reducer; 