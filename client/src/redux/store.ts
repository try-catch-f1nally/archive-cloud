import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth/slice';
import archiveReducer from './upload/slice';
import {authApi} from './auth/auth-api';
import {uploadApi} from './upload/upload-api';
import {storageApi} from './storage/storage-api';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    archive: archiveReducer,
    [authApi.reducerPath]: authApi.reducer,
    [uploadApi.reducerPath]: uploadApi.reducer,
    [storageApi.reducerPath]: storageApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, uploadApi.middleware, storageApi.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
