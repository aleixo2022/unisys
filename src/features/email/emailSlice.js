import { createSlice } from '@reduxjs/toolkit';

export const emailSlice = createSlice({
  name: 'email',
  initialState: {
    value: '',
  },
  reducers: {
    setEmail: (state, action) => {
      state.value = action.payload;
    },
    clearEmail: (state) => {
      state.value = '';
    }
  },
});

export const { setEmail, clearEmail } = emailSlice.actions;
export const selectEmail = (state) => state.email.value;
export default emailSlice.reducer;