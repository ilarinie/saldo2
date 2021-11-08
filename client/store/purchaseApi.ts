import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Purchase } from 'types'
import { budgetApi } from './budgetApi'

export const purchaseApi = createApi({
  reducerPath: 'purchaseApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: builder => ({
    createPurchase: builder.mutation<Purchase, Partial<Purchase>>({
      query: ({ ...purchase }) => ({ url: '/purchases', method: 'POST', body: purchase }),
      onQueryStarted: async ({ ...purchase }, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled
          dispatch(budgetApi.endpoints.refreshBudget.initiate({ budgetId: purchase.budgetId as string }))
        } catch (err) {
          //NOP
        }
      },
    }),
    deletePurchase: builder.mutation<void, { purchaseId: string; budgetId: string }>({
      query: ({ purchaseId }) => ({ url: `/purchases/${purchaseId}`, method: 'DELETE' }),
      onQueryStarted: async ({ budgetId }, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        dispatch(budgetApi.endpoints.refreshBudget.initiate({ budgetId }, { forceRefetch: true }))
      },
    }),
  }),
})

export const { useCreatePurchaseMutation, useDeletePurchaseMutation } = purchaseApi

export default purchaseApi.reducer
