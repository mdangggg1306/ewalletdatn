import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userdata: null,
  token: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (state, action) => {
      state.userdata = action.payload.userdata;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.userdata = null;
      state.token = null;
    },
  },
});

export const { setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;