import { createSlice } from "@reduxjs/toolkit";
import { deepUpdate } from "../../../../../utils/other/object";
import { fetchNewVisibleEventAsyncThunk, manageVisibleEventSubscriptionStateAsyncThunk } from "./thunks";





const visibleEventSlice = createSlice({
  name: "visibleEvent",
  reducerPath: "visibleEvent",
  initialState: {
    state: null,
    error: null,
  },
  reducers: {
    setState: (state, action) => {
      state.state = action.payload;
    },
    setStateProps: (state, action) => {
      state.state = deepUpdate(state.state, action.payload);
    },
    setEntityStateError: (state, action) => { // this error is for event actions errors (subscription error, etc...)
      state.state.error = action.payload; 
    },
    setError: (state, action) => { // this error are for first loads
      state.error = action.payload;
    },
    teardownState: (state) => {
      state.state = null;
      state.error = null;
    }
  },
  extraReducers: builder => {
    builder
    .addCase(fetchNewVisibleEventAsyncThunk.fulfilled, (state, action) => {
      state.state = action.payload;
    })
    .addCase(fetchNewVisibleEventAsyncThunk.rejected, (state, action) => {
      state.error = action.payload;
    })

    .addCase(manageVisibleEventSubscriptionStateAsyncThunk.fulfilled, (state, action) => {
      console.warn("llega", action.meta.arg);
      const { managementType } = action.meta.arg;
      if(managementType === "subscribe") {
        state.state.subscribed = true;
        state.state.subscribedUsers = [ ...state.state.subscribedUsers, { _id: action.payload._id, date: new Date() } ];
      }
      else {
        state.state.subscribed = false;
        state.state.subscribedUsers = state.state.subscribedUsers.filter(subscribedUser => subscribedUser._id !== action.payload._id);
      }
    })
    .addCase(manageVisibleEventSubscriptionStateAsyncThunk.rejected, (state, action) => {
      state.state.error = action.payload;
    })
  }
});



export default visibleEventSlice;