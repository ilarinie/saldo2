import { Purchase } from 'types'
import { api } from './api'

export const purchaseApi = api.injectEndpoints({
  endpoints: builder => ({
    createPurchase: builder.mutation<Purchase, Partial<Purchase>>({
      query: ({ ...purchase }) => ({ url: '/purchases', method: 'POST', body: purchase }),
      invalidatesTags: (result, query, args) => [{ type: 'Budget', id: args.budgetId }],
    }),
    deletePurchase: builder.mutation<void, { purchaseId: string; budgetId: string }>({
      query: ({ purchaseId }) => ({ url: `/purchases/${purchaseId}`, method: 'DELETE' }),
      invalidatesTags: (result, query, args) => [{ type: 'Budget', id: args.budgetId }],
    }),
  }),
})

export const { useCreatePurchaseMutation, useDeletePurchaseMutation } = purchaseApi

export default purchaseApi.reducer
