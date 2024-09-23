import { createAsyncThunk } from "@reduxjs/toolkit";
import { acceptInvitation, getInvitations, rejectInvitation } from "../../../../../utils/fetch/invitation";



export const fetchInvitationsAsyncThunk = createAsyncThunk(
  `invitations/fetchInvitations`,
  async (_, { getState, rejectWithValue }) => {
    const { invitations: invitationsState, user } = getState();
    const options = invitationsState.options;
    const response = await getInvitations({ type: options.filter.type, recent: options.recent, search: options.search, skip: invitationsState.ids.length });
    const { success, data, error } = response.data;
    if(success === false) return rejectWithValue(error);
    
    data.forEach(invitation => {
      const userUsageStateInfo = invitation.invitedUsers.find(invitedUser => invitedUser._id === user._id);
      invitation.usageState = userUsageStateInfo.usageState;
    });
    return data;
  }
);


export const manageInvitationAsyncThunk = createAsyncThunk(
  `invitations/manageInvitation`,
  async ({ _id, managementType}, { rejectWithValue }) => {
    let response;
    if(managementType === "accept") {
      response = await acceptInvitation(_id);
    }
    else {
      response = await rejectInvitation(_id);
    };
    const { success, data, error } = response.data;
    if(success === false) return rejectWithValue(error);
    return data;
  }
)
