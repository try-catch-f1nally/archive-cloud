import {createApi, BaseQueryFn, FetchArgs} from '@reduxjs/toolkit/query/react';
import {authFetchBaseQuery} from '../auth/authFetchBaseQuery';
import {File} from './types';

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const baseUrl = process.env.REACT_APP_STORAGE_API_URL;

export const storageApi = createApi({
  reducerPath: 'api/storage',
  baseQuery: authFetchBaseQuery({baseUrl, credentials: 'include'}) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    {data: {message: string}}
  >,
  endpoints: (builder) => ({
    getFiles: builder.query<File[], void>({
      query: (body) => ({
        url: ''
      })
    })
  })
});

export const {useGetFilesQuery} = storageApi;
export default storageApi.reducer;
