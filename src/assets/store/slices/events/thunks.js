import { createAsyncThunk } from "@reduxjs/toolkit";
import { getEvents, joinEvent, leaveEvent } from "../../../../../utils/fetch/event";




export const fetchEventsAsyncThunk = createAsyncThunk(
  "events/fetchEvents",
  async (_, { getState, rejectWithValue }) => {
    const { events: eventsState, user } = getState();
    const { ids, options } = eventsState;
    const response = await getEvents({ type: options.filter.type, search: options.search, closest: options.closest, subscribed: options.filter.subscribed, skip: ids.length });
    const { success, data, error } = response.data;
    if(success === false) return rejectWithValue(error);

    data.forEach(event => {
      const userInEvent = event.subscribedUsers.find(subscribedUser => subscribedUser._id === user._id);
      if(userInEvent !== undefined) {
        event.subscribed = true;
      }
      else {
        event.subscribed = false;
      };
    });

    return data;
  }
);



export const manageEventSuscriptionAsyncThunk = createAsyncThunk(
  "events/manageEventSuscription",
  async ({ _id, managementType }, { rejectWithValue }) => {
    let response;
    if(managementType === "subscribe") {
      response = await joinEvent(_id)
    }
    else {
      response = await leaveEvent(_id);
    };

    const { success, data, error } = response.data;
    if(success === false) return rejectWithValue(error);
    return data;
  }
)


