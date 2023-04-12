import {createSlice} from '@reduxjs/toolkit';
import {ArchiveState} from './types';
import {uploadApi} from './upload-api';

const initialState: ArchiveState = {
  status: 'process'
};

export const uploadSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(uploadApi.endpoints.getStatus.matchFulfilled, (state, {payload}) => {
      state.status = payload.status;
    });
  }
});

export default uploadSlice.reducer;
