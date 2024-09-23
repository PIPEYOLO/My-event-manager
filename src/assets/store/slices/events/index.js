import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { deepUpdate } from "../../../../../utils/other/object.js"
import { fetchEventsAsyncThunk, manageEventSuscriptionAsyncThunk } from "./thunks.js";


const adapter = createEntityAdapter({
  selectId: event => event._id,
});

const initialState = adapter.getInitialState({
  error: null,
  firstLoadDone: false,
  allEventsObtained: false,
  options: {
    filter: { type: "pending", subscribed: true },
    closest: true,
    search: ""
  }
});

const eventsSlice = createSlice({
  name: "events",
  reducerPath: "events",
  initialState,
  reducers: {
    updateEvent: adapter.updateOne,
    setOptions: (state, action) => {
      state.options = deepUpdate(state.options, action.payload);
    },
    teardownState: (state) => {
      adapter.removeAll(state);
      state.error = null;
      state.firstLoadDone = false;
      state.allEventsObtained = false;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchEventsAsyncThunk.fulfilled, (state, action) => {
      adapter.addMany(state, action.payload);
      if(state.firstLoadDone === false) {
        state.firstLoadDone = true
      }
    })
    .addCase(fetchEventsAsyncThunk.rejected, (state, action) => {
      state.error = action.payload;
      if(state.firstLoadDone === false) {
        state.firstLoadDone = true
      };
      if(state.error.status === 404) {
        state.allEventsObtained = true;
      }
    })

    // Event suscription
    .addCase(manageEventSuscriptionAsyncThunk.fulfilled, (state, action) => { // events subscribed or unsubscribed successfully
      let subscribed;
      if(action.meta.arg.managementType === "subscribe") subscribed = true;
      else subscribed = false;

      adapter.updateOne(state, { id: action.meta.arg._id, changes: { subscribed } });
    })
    .addCase(manageEventSuscriptionAsyncThunk.rejected, (state, action) => { //  events subscription or unsuscription had a problem
      adapter.updateOne(state, { id: action.meta.arg._id, changes: { error: action.payload } });
    })



  }
});


export const eventsSliceActions = eventsSlice.actions;

export default eventsSlice;


