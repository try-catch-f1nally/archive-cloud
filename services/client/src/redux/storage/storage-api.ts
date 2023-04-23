import {createApi, BaseQueryFn, FetchArgs} from '@reduxjs/toolkit/query/react';
import {authFetchBaseQuery} from '../auth/authFetchBaseQuery';
import {File} from './types';

// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
const baseUrl = `${process.env.REACT_APP_API_GATEWAY}/api/storage`;

export const storageApi = createApi({
  reducerPath: 'api/storage',
  baseQuery: authFetchBaseQuery({baseUrl, credentials: 'include'}) as BaseQueryFn<
    string | FetchArgs,
    unknown,
    {data: {message: string}}
  >,
  tagTypes: ['File'],
  endpoints: (builder) => ({
    getFiles: builder.query<File[], void>({
      query: () => ({
        url: 'archives'
      }),
      providesTags: ['File']
    }),
    deleteFile: builder.mutation<void, {id: string}>({
      query: (body) => ({
        url: `archives/${body.id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['File']
    })
  })
});

export const {useGetFilesQuery, useDeleteFileMutation} = storageApi;
export default storageApi.reducer;
