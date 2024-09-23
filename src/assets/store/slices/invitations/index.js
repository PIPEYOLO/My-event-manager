import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { fetchInvitationsAsyncThunk, manageInvitationAsyncThunk } from "./thunks";
import { deepUpdate } from "../../../../../utils/other/object";


const adapter = createEntityAdapter({
  selectId: invitation => invitation._id,
});

const initialState = adapter.getInitialState({
  error: null,
  firstLoadDone: false,
  allInvitationsObtained: false,
  options: {
    filter: { type: "pending" },
    recent: true,
    search: ""
  }
});

const invitationsSlice = createSlice({
  name: "invitations",
  reducerPath: "invitations",
  initialState,
  reducers: {
    updateInvitation: adapter.updateOne,
    setOptions: (state, action) => {
      state.options = deepUpdate(state.options, action.payload);
    },
    teardownState: (state) => {
      adapter.removeAll(state);
      state.error = null;
      state.firstLoadDone = false;
      state.allInvitationsObtained = false;
    }
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchInvitationsAsyncThunk.fulfilled, (state, action) => {
      adapter.addMany(state, action.payload);
      if(state.firstLoadDone === false) {
        state.firstLoadDone = true
      }
    })
    .addCase(fetchInvitationsAsyncThunk.rejected, (state, action) => {
      state.error = action.payload;
      if(state.firstLoadDone === false) {
        state.firstLoadDone = true
      };
      if(state.error.status === 404) {
        state.allInvitationsObtained = true;
      }
    })

    // Invitation Management
    .addCase(manageInvitationAsyncThunk.fulfilled, (state, action) => { // invitation accepted or rejected successfully
      const newUsageState = action.meta.arg.managementType + "ed"; // ("accept" | "reject") + "ed"
      adapter.updateOne(state, { id: action.meta.arg._id, changes: { usageState: newUsageState} });
    })
    .addCase(manageInvitationAsyncThunk.rejected, (state, action) => { // invitation acceptation or rejection had a problem
      adapter.updateOne(state, { id: action.meta.arg._id, changes: { error: action.payload } });
    })



  }
});


export const invitationsSliceActions = invitationsSlice.actions;

export default invitationsSlice;


