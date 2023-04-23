import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {ArchivingStatus} from './types';
import {uploadApi} from './upload-api';

const initialState = 'process' as ArchivingStatus;

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      uploadApi.endpoints.getStatus.matchFulfilled,
      (state, {payload}: PayloadAction<ArchivingStatus>) => payload
    );
  }
});

export default uploadSlice.reducer;
