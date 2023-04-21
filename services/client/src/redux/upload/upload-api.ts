import {createApi, BaseQueryFn, FetchArgs} from '@reduxjs/toolkit/query/react';
import {ArchivingStatus} from './types';
import {authFetchBaseQuery} from '../auth/authFetchBaseQuery';

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const baseUrl = process.env.REACT_APP_UPLOAD_API_URL;

export const uploadApi = createApi({
  reducerPath: 'api/upload',
  baseQuery: authFetchBaseQuery({baseUrl, credentials: 'include'}) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    {data: {message: string}}
  >,
  endpoints: (builder) => ({
    create: builder.mutation<void, FormData>({
      query: (body) => ({
        url: 'upload',
        method: 'POST',
        body
      })
    }),
    getStatus: builder.query<ArchivingStatus, void>({
      query: () => ({
        url: 'upload/status',
        method: 'POST'
      })
    })
  })
});

export const {useCreateMutation, useGetStatusQuery} = uploadApi;
export default uploadApi.reducer;