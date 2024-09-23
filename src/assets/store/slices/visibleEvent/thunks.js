import { createAsyncThunk } from "@reduxjs/toolkit";
import { getSpecificEvent, joinEvent, leaveEvent } from "../../../../../utils/fetch/event";


export const fetchNewVisibleEventAsyncThunk = createAsyncThunk(
  "visibleEvent/fetchNewEvent",
  async ({ _id }, { rejectWithValue, getState }) => {
    const { user } = getState();
    const response = await getSpecificEvent(_id, {});
    const { success, data, error } = response.data;

    if(success === false) return rejectWithValue(error);

    if(data.subscribedUsers.find(subscribedUsers => subscribedUsers._id === user._id) !== undefined) {
      data.subscribed = true;
    }
    else {
      data.subscribed = false;
    }

    return data;
  }
);


export const manageVisibleEventSubscriptionStateAsyncThunk = createAsyncThunk(
  "visibleEvent/manageSubscriptionState",
  async ({ managementType }, { rejectWithValue, getState }) => {
    const { visibleEvent, user } = getState();
    let response;
    if(managementType === "subscribe") {
      response = await joinEvent(visibleEvent.state._id)
    }
    else {
      response = await leaveEvent(visibleEvent.state._id);
    };

    const { success, data, error } = response.data;

    if(success === false) return rejectWithValue(error);
    return user;
  }
)


