import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isAuthenticated: false,
  accessToken: localStorage.getItem('access_token'),
  refreshToken: localStorage.getItem('refresh_token')
};

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      localStorage.setItem('access_token', action.payload.accessToken);
      localStorage.setItem('refresh_token', action.payload.refreshToken);
      state.isAuthenticated = true;
    },
    logout: (state) => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      state.accessToken = '';
      state.refreshToken = '';
      state.isAuthenticated = false;
      window.location.href = '/login';
    },
  }
});

export const { setAuthenticated, setTokens, logout } = sessionSlice.actions;

export const selectIsAuthenticated = (state) => state.session.isAuthenticated;

export default sessionSlice.reducer;
