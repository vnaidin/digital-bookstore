import { logOut, User } from '@/store/user';
import {
  Book, BooksResponse,
CreateOrderPayload,
CreateOrderResponse,
  Merch, MerchResponse,
  MessageResponse,   NewsArticle, NewsResponse,
  Order,   PromoCode,
} from '@/types';

import { BaseQueryFn, createApi, FetchArgs, fetchBaseQuery, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

type FilterParams = Record<string, string | number | boolean | null | undefined>;

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface UpdateUserPayload {
  wishList?: string;
  name?: string;
  surname?: string;
  phoneNumber?: string;
}

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
    getBooks: builder.query<BooksResponse, FilterParams>({
      query: (params) => ({ url: '/all/books', params }),
      providesTags: ['Books'],
    }),
    searchBooks: builder.query<{ books: Book[] }, string>({
      query: (search) => ({ url: '/books/search', params: { search } }),
      providesTags: ['Books'],
    }),
    getBookById: builder.query<Book, number | string>({
      query: (id) => `/book/${id}`,
    }),
    createBook: builder.mutation<MessageResponse, FormData>({
      query: (body) => ({ url: '/book', method: 'POST', body, headers: authHeader() }),
      invalidatesTags: ['Books'],
    }),
    updateBook: builder.mutation<MessageResponse, { id: number; body: FormData }>({
      query: ({ id, body }) => ({ url: `/book/${id}`, method: 'PUT', body, headers: authHeader() }),
      invalidatesTags: ['Books'],
    }),
    deleteBook: builder.mutation<MessageResponse, number>({
      query: (id) => ({ url: `/book/${id}`, method: 'DELETE', headers: authHeader() }),
      invalidatesTags: ['Books'],
    }),

    // ── Merch ─────────────────────────────────────────────────────────
    getMerch: builder.query<MerchResponse, FilterParams>({
      query: (params) => ({ url: '/all/merch', params }),
      providesTags: ['Merch'],
    }),
    searchMerch: builder.query<{ merch: Merch[] }, string>({
      query: (search) => ({ url: '/merches/search', params: { search } }),
      providesTags: ['Merch'],
    }),
    getMerchById: builder.query<Merch, number | string>({
      query: (id) => `/merch/${id}`,
    }),
    createMerch: builder.mutation<MessageResponse, FormData>({
      query: (body) => ({ url: '/merch', method: 'POST', body, headers: authHeader() }),
      invalidatesTags: ['Merch'],
    }),
    updateMerch: builder.mutation<MessageResponse, { id: number; body: FormData }>({
      query: ({ id, body }) => ({ url: `/merch/${id}`, method: 'PUT', body, headers: authHeader() }),
      invalidatesTags: ['Merch'],
    }),
    deleteMerch: builder.mutation<MessageResponse, number>({
      query: (id) => ({ url: `/merch/${id}`, method: 'DELETE', headers: authHeader() }),
      invalidatesTags: ['Merch'],
    }),

    // ── News ──────────────────────────────────────────────────────────
    getNews: builder.query<NewsResponse, FilterParams>({
      query: (params) => ({ url: '/all/news', params }),
      providesTags: ['News'],
    }),
    getNewsById: builder.query<NewsArticle, number | string>({
      query: (id) => `/news/${id}`,
    }),
    createNews: builder.mutation<MessageResponse, FormData>({
      query: (body) => ({ url: '/news', method: 'POST', body, headers: authHeader() }),
      invalidatesTags: ['News'],
    }),
    updateNews: builder.mutation<MessageResponse, { id: number; body: FormData }>({
      query: ({ id, body }) => ({ url: `/news/${id}`, method: 'PUT', body, headers: authHeader() }),
      invalidatesTags: ['News'],
    }),
    deleteNews: builder.mutation<MessageResponse, number>({
      query: (id) => ({ url: `/news/${id}`, method: 'DELETE', headers: authHeader() }),
      invalidatesTags: ['News'],
    }),

    // ── Orders ────────────────────────────────────────────────────────
    getOrders: builder.query<Order[], FilterParams>({
      query: (params) => ({ url: '/all/orders', params, headers: authHeader() }),
      providesTags: ['Orders'],
    }),
    searchOrders: builder.query<Order[], string>({
      query: (search) => ({ url: '/orders/search', params: { search }, headers: authHeader() }),
      providesTags: ['Orders'],
    }),
    getOrderById: builder.query<Order[], number | string>({
      query: (id) => ({ url: `/order/${id}`, headers: authHeader() }),
    }),
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderPayload>({
      query: (body) => ({ url: '/order', method: 'POST', body, headers: { ...authHeader(), 'Content-Type': 'application/json' } }),
      invalidatesTags: ['Orders'],
    }),
    updateOrder: builder.mutation<MessageResponse, { id: number; body: Partial<Pick<Order, 'status' | 'ttn'>> }>({
      query: ({ id, body }) => ({ url: `/order/${id}`, method: 'PUT', body, headers: { ...authHeader(), 'Content-Type': 'application/json' } }),
      invalidatesTags: ['Orders'],
    }),
    deletePromoCode: builder.mutation<MessageResponse, { orderId: number; promocode: string }>({
      query: ({ orderId, promocode }) => ({ url: `/order/${promocode}/${orderId}`, method: 'DELETE', headers: authHeader() }),
      invalidatesTags: ['Orders'],
    }),

    // ── Auth ──────────────────────────────────────────────────────────
    login: builder.mutation<User, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/signin', method: 'POST', body }),
    }),
    register: builder.mutation<User, RegisterPayload>({
      query: (body) => ({ url: '/auth/signup', method: 'POST', body }),
    }),
    requestPasswordReset: builder.mutation<MessageResponse, { email: string }>({
      query: (body) => ({ url: '/auth/requestResetPass', method: 'POST', body }),
    }),
    resetPassword: builder.mutation<MessageResponse, { password: string; token: string | null; id: string | null }>({
      query: (body) => ({ url: '/auth/resetPass', method: 'POST', body }),
    }),

    // ── Misc ──────────────────────────────────────────────────────────
    getItem: builder.query<Book | Merch, number | string>({
      query: (id) => `/item/${id}`,
    }),
    getPromoCodes: builder.query<PromoCode[], void>({
      query: () => ({ url: '/all/promo', headers: authHeader() }),
      transformResponse: (raw: string) => JSON.parse(window.atob(raw)),
    }),
    getPromoByName: builder.query<PromoCode | null, string>({
      query: (name) => ({ url: '/promo', params: { name } }),
    }),
    updateUser: builder.mutation<MessageResponse, { id: number; body: UpdateUserPayload }>({
      query: ({ id, body }) => ({ url: `/user/${id}`, method: 'PUT', body, headers: { ...authHeader(), 'Content-Type': 'application/json' } }),
    }),
    deleteUser: builder.mutation<MessageResponse, number>({
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
  useGetPromoByNameQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = shopApi;
