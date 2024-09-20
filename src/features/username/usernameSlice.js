import { createSlice } from '@reduxjs/toolkit';

export const usernameSlice = createSlice({
  name: 'username',
  initialState: {
    value: '',
  },
  reducers: {
    setUsername: (state, action) => {
      state.value = action.payload;
    },
    clearUsername: state => {
      state.value = '';
    }
  },
});

export const { setUsername, clearUsername } = usernameSlice.actions;
export default usernameSlice.reducer;
