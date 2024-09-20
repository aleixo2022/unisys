import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import errorReducer from '../features/error/errorSlice';
import usernameReducer from '../features/username/usernameSlice';
import emailReducer from '../features/email/emailSlice';
import sessionReducer from '../features/session/sessionSlice';
import passwordSlice from '../features/password/passwordSlice';
import identityVerifySlice from '../features/identity/identityVerify';

const persistConfig = {
  key: 'root',
  storage,
};

const rootReducer = combineReducers({
  error: errorReducer,
  username: usernameReducer,
  email: emailReducer,
  session: sessionReducer,
  password: passwordSlice,
  identityVerify:identityVerifySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/PURGE'],
        ignoredPaths: ['session.refreshToken', 'session.accessToken'],
      },
    }),
});

export const persistor = persistStore(store);
