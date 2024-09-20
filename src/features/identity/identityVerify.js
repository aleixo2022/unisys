import { createSlice } from '@reduxjs/toolkit';

export const identityVerifySlice = createSlice({
  name: 'identityVerify',
  initialState: {
    value: false,
  },
  reducers: {
    setIdentityVerify: (state, action) => {
      state.value = action.payload;
    },
    resetIdentityVerify: (state) => {
      state.value = false;
    }
  },
});

export const { setIdentityVerify, resetIdentityVerify } = identityVerifySlice.actions;
export const selectIdentityVerify = (state) => state.identityVerify.value;
export default identityVerifySlice.reducer;

