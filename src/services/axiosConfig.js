import axios from 'axios';
import { store } from '../store/store';
import { logout, setTokens } from '../features/session/sessionSlice';
const API_URL= import.meta.env.VITE_NGROK_LINK;
//axios.defaults.baseURL = 'https://unisys-7981816f1ad6.herokuapp.com';
axios.defaults.baseURL =  `${API_URL}`;

axios.defaults.withCredentials = true;
// Adicionar o cabeçalho ngrok-skip-browser-warning em todas as requisições
axios.defaults.headers.common['ngrok-skip-browser-warning'] = 'true';

axios.interceptors.request.use(config => {
  const state = store.getState();
  const token = state.session.accessToken;
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axios.interceptors.response.use(response => response, async error => {
  const originalRequest = error.config;
  if (error.response && error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    try {
      const state = store.getState();
      const refreshToken = state.session.refreshToken;

      const response = await axios.post('/auth/token/refresh', {}, {
        headers: {'Authorization': `Bearer ${refreshToken}`}
      });
      
      if (response.status === 200) {

        if(response.data.access_token){
          store.dispatch(setTokens({
            accessToken: response.data.access_token,
            refreshToken: response.data.refresh_token
          }));

          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access_token}`;
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access_token}`;
        }

        return axios(originalRequest);
      }
    } catch (refreshError) {
      store.dispatch(logout());
    }
  }
  return Promise.reject(error);
});

export default axios;
