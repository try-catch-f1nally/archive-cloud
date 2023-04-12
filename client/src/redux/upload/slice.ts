import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {UploadingStatus} from './types';
import {uploadApi} from './upload-api';

const initialState = 'process' as UploadingStatus;

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      uploadApi.endpoints.getStatus.matchFulfilled,
      (state, {payload}: PayloadAction<UploadingStatus>) => payload
    );
  }
});

export default uploadSlice.reducer;
