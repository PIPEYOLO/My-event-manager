import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  reducerPath: "user",
  initialState: {
    _id: null,
    name: null,
    error: null
  },
  reducers: {
    setData:  (state, action) => {
      const { payload } = action;
      const { _id, name, state: userState } = payload;
      state._id = _id;
      state.name = name;
      state.state = userState;
    },

    unsetAllData: (state) => {
      state._id = null;
      state.name = null;
      state.error = null;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { setError, unsetAllData } = userSlice.actions;

export default userSlice;