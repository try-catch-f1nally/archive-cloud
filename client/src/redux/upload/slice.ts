import {createSlice} from '@reduxjs/toolkit';
import {ArchiveState} from './types';
import {uploadApi} from './upload-api';

const initialState: ArchiveState = {};

export const uploadSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(uploadApi.endpoints.getProgress.matchFulfilled, (state, {payload}) => {
      state.status = payload.status;
      state.percentage = payload.percentage;
      state.errorMessage = payload.errorMessage;
    });
  }
});

export default uploadSlice.reducer;
