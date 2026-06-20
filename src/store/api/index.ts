import { BaseQueryFn, createApi, fetchBaseQuery, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { logOut } from '@/store/user';

function authHeader() {
  const raw = localStorage.getItem('user');
  const user = raw ? JSON.parse(raw) : null;
  return user?.accessToken ? { authorization: `Bearer ${user.accessToken}` } : {};
}

const rawBaseQuery = fetchBaseQuery({ baseUrl: '/api' });

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions,
) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) {
    localStorage.removeItem('user');
    api.dispatch(logOut());
  }
  return result;
};

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Books', 'Merch', 'News', 'Orders'],
  endpoints: (builder) => ({

    // ── Books ──────────────────────────────────────────────────────────
    getBooks: builder.query<any, Record<string, any>>({
      query: (params) => ({ url: '/all/books', params }),
      providesTags: ['Books'],
    }),
    searchBooks: builder.query<any, string>({
      query: (search) => ({ url: '/books/search', params: { search } }),
      providesTags: ['Books'],
    }),
    getBookById: builder.query<any, number | string>({
      query: (id) => `/book/${id}`,
    }),
    createBook: builder.mutation<any, FormData>({
      query: (body) => ({ url: '/book', method: 'POST', body, headers: authHeader() }),
      invalidatesTags: ['Books'],
    }),
    updateBook: builder.mutation<any, { id: number; body: FormData }>({
      query: ({ id, body }) => ({ url: `/book/${id}`, method: 'PUT', body, headers: authHeader() }),
      invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation<any, number>({
      query: (id) => ({ url: `/book/${id}`, method: 'DELETE', headers: authHeader() }),
      invalidatesTags: ['Books'],
    }),

    // ── Merch ─────────────────────────────────────────────────────────
    getMerch: builder.query<any, Record<string, any>>({
      query: (params) => ({ url: '/all/merch', params }),
      providesTags: ['Merch'],
    }),
    searchMerch: builder.query<any, string>({
      query: (search) => ({ url: '/merches/search', params: { search } }),
      providesTags: ['Merch'],
    }),
    getMerchById: builder.query<any, number | string>({
      query: (id) => `/merch/${id}`,
    }),
    createMerch: builder.mutation<any, FormData>({
      query: (body) => ({ url: '/merch', method: 'POST', body, headers: authHeader() }),
      invalidatesTags: ['Merch'],
    }),
    updateMerch: builder.mutation<any, { id: number; body: FormData }>({
      query: ({ id, body }) => ({ url: `/merch/${id}`, method: 'PUT', body, headers: authHeader() }),
      invalidatesTags: ['Merch'],
    }),
    deleteMerch: builder.mutation<any, number>({
      query: (id) => ({ url: `/merch/${id}`, method: 'DELETE', headers: authHeader() }),
      invalidatesTags: ['Merch'],
    }),

    // ── News ──────────────────────────────────────────────────────────
    getNews: builder.query<any, Record<string, any>>({
      query: (params) => ({ url: '/all/news', params }),
      providesTags: ['News'],
    }),
    getNewsById: builder.query<any, number | string>({
      query: (id) => `/news/${id}`,
    }),
    createNews: builder.mutation<any, FormData>({
      query: (body) => ({ url: '/news', method: 'POST', body, headers: authHeader() }),
      invalidatesTags: ['News'],
    }),
    updateNews: builder.mutation<any, { id: number; body: FormData }>({
      query: ({ id, body }) => ({ url: `/news/${id}`, method: 'PUT', body, headers: authHeader() }),
      invalidatesTags: ['News'],
    }),
    deleteNews: builder.mutation<any, number>({
      query: (id) => ({ url: `/news/${id}`, method: 'DELETE', headers: authHeader() }),
      invalidatesTags: ['News'],
    }),

    // ── Orders ────────────────────────────────────────────────────────
    getOrders: builder.query<any, Record<string, any>>({
      query: (params) => ({ url: '/all/orders', params, headers: authHeader() }),
      providesTags: ['Orders'],
    }),
    searchOrders: builder.query<any, string>({
      query: (search) => ({ url: '/orders/search', params: { search }, headers: authHeader() }),
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query<any, number | string>({
      query: (id) => ({ url: `/order/${id}`, headers: authHeader() }),
    }),
    createOrder: builder.mutation<any, any>({
      query: (body) => ({ url: '/order', method: 'POST', body, headers: { ...authHeader(), 'Content-Type': 'application/json' } }),
      invalidatesTags: ['Orders'],
    }),
    updateOrder: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({ url: `/order/${id}`, method: 'PUT', body, headers: { ...authHeader(), 'Content-Type': 'application/json' } }),
      invalidatesTags: ['Orders'],
    }),
    deletePromoCode: builder.mutation<any, { orderId: number; promocode: string }>({
      query: ({ orderId, promocode }) => ({ url: `/order/${promocode}/${orderId}`, method: 'DELETE', headers: authHeader() }),
      invalidatesTags: ['Orders'],
    }),

    // ── Auth ──────────────────────────────────────────────────────────
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/signin', method: 'POST', body }),
    }),
    register: builder.mutation<any, any>({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body }),
    }),
    requestPasswordReset: builder.mutation<any, { email: string }>({
      query: (body) => ({ url: '/auth/requestResetPass', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<any, { password: string; token: string | null; id: string | null }>({
      query: (body) => ({ url: '/auth/resetPass', method: 'POST', body }),
    }),

    // ── Misc ──────────────────────────────────────────────────────────
    getItem: builder.query<any, number | string>({
      query: (id) => `/item/${id}`,
    }),
    getPromoCodes: builder.query<any, void>({
      query: () => '/all/promo',
      transformResponse: (raw: string) => JSON.parse(window.atob(raw)),
    }),
    updateUser: builder.mutation<any, { id: number; body: any }>({
      query: ({ id, body }) => ({ url: `/user/${id}`, method: 'PUT', body, headers: { ...authHeader(), 'Content-Type': 'application/json' } }),
    }),
    deleteUser: builder.mutation<any, number>({
      query: (id) => ({ url: `/user/${id}`, method: 'DELETE', headers: authHeader() }),
    }),
  }),
});

export const {
  useGetBooksQuery,
  useSearchBooksQuery,
  useGetBookByIdQuery,
  useCreateBookMutation,
  useUpdateBookMutation,
  useDeleteBookMutation,
  useGetMerchQuery,
  useSearchMerchQuery,
  useGetMerchByIdQuery,
  useCreateMerchMutation,
  useUpdateMerchMutation,
  useDeleteMerchMutation,
  useGetNewsQuery,
  useGetNewsByIdQuery,
  useCreateNewsMutation,
  useUpdateNewsMutation,
  useDeleteNewsMutation,
  useGetOrdersQuery,
  useSearchOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeletePromoCodeMutation,
  useLoginMutation,
  useRegisterMutation,
  useRequestPasswordResetMutation,
  useResetPasswordMutation,
  useGetItemQuery,
  useGetPromoCodesQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = shopApi;
