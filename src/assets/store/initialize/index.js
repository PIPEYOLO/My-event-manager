import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../slices/user"
import storeRootReducer from "..";




export default async function initializeStore(url, { req, state }) {
  const { user, event, error } = state;

  const store = configureStore({ reducer: storeRootReducer });

  try {
    if(user?._id != undefined) {
      store.dispatch(userSlice.actions.setData(user)); // we set the user info
    }

  }
  catch(err) {
    console.log(err);
  }

  return store;
};