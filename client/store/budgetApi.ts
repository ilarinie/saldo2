import { Budget } from 'types'
import { api } from './api'
import { extractPayload } from './extractPayload'
import { createPurchaseOptions } from './purchaseAutocompleteOptions'

export const budgetApi = api.injectEndpoints({
  endpoints: builder => ({
    getBudgets: builder.query<{ ids: string[]; map: { [key: string]: Budget } }, void>({
      query: () => '/budgets',
      transformResponse: (response: { message: string; payload: Budget[] }, meta) => {
        const ids: string[] = []
        const map: { [key: string]: Budget } = {}
        response.payload.forEach(r => {
          ids.push(r._id)
          map[r._id] = r
        })
        return { ids, map }
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const budgetData = await (await queryFulfilled).data
          budgetData.ids.forEach(id => dispatch(createPurchaseOptions(budgetData.map[id])))
        } catch (err) {
          console.error('Could not create purchase options')
        }
      },
    }),
    getBudget: builder.query<Budget, string>({
      query: budgetId => `/budgets/${budgetId}`,
      transformResponse: (response: { message: string; payload: Budget }, meta) => {
        return response.payload
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const budgetData = await (await queryFulfilled).data
          dispatch(createPurchaseOptions(budgetData))
        } catch (err) {
          console.error('Could not create purchase options')
        }
      },
      providesTags: result => (result ? [{ type: 'Budget', id: result._id }] : []),
    }),
    refreshBudget: builder.query<Budget, { budgetId: string }>({
      query: ({ budgetId }) => `/budgets/${budgetId}`,
      transformResponse: extractPayload,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        console.log('bong')
        try {
          const budget = await (await queryFulfilled).data
          console.log('newBudget', budget)
          dispatch(updateBudgetInCacheAction(budget))
          dispatch(createPurchaseOptions(budget))
        } catch (err) {
          console.error('Could not update budget')
        }
      },
    }),
    addBudgetUser: builder.mutation<void, { budgetId: string; username: string }>({
      query: ({ budgetId, username }) => ({
        url: `/budgets/${budgetId}/addnewusers`,
        method: 'POST',
        body: { username },
      }),
      onQueryStarted: async ({ budgetId }, { dispatch, queryFulfilled }) => {
        await queryFulfilled
        dispatch(budgetApi.endpoints.refreshBudget.initiate({ budgetId }))
      },
    }),
    addBudget: builder.mutation<Budget, { name: string; type?: 'saldo' | 'budget' }>({
      query: ({ name, type = 'budget' }) => ({
        url: `/budgets`,
        method: 'POST',
        body: { name },
      }),
      transformResponse: extractPayload,
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        const budget = await (await queryFulfilled).data
        dispatch(updateBudgetInCacheAction(budget))
      },
    }),
  }),
})

export const updateBudgetInCacheAction = (budget: Budget) =>
  budgetApi.util.updateQueryData('getBudgets', undefined, state => {
    if (!state.ids.includes(budget._id)) {
      state.ids.push(budget._id)
    }
    state.map[budget._id] = budget
  })

export const { useGetBudgetQuery, useLazyGetBudgetQuery, useGetBudgetsQuery, useAddBudgetUserMutation, useAddBudgetMutation } = budgetApi

export default budgetApi.reducer
