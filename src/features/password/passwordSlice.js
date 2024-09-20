import { createSlice } from '@reduxjs/toolkit';

export const passwordSlice = createSlice({
  name: 'password',
  initialState: {
    value: '',
  },
  reducers: {
    setPassword: (state, action) => {
      state.value = action.payload;
    },
    clearPassword: (state) => {
      state.value = '';
    },
  },
});

export const { setPassword, clearPassword } = passwordSlice.actions;
export default passwordSlice.reducer;
