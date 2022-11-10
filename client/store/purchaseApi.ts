import _ from 'lodash'
import { Purchase } from 'types'
import { api } from './api'
import { budgetApi } from './budgetApi'

const requestIds: string[] = []

export const purchaseApi = api.injectEndpoints({
  endpoints: builder => ({
    createPurchase: builder.mutation<Purchase, Partial<Purchase>>({
      query: ({ ...purchase }) => {
        return { url: '/purchases', method: 'POST', body: purchase }
      },
      invalidatesTags: (result, query, args) => [{ type: 'Budget', id: args.budgetId }],
      async onQueryStarted(purchase, foo) {
        if (requestIds.includes(foo.requestId)) {
          return
        }
        requestIds.push(foo.requestId)
        if (requestIds.length > 10) {
          requestIds.splice(10)
        }
        const patchResult = foo.dispatch(
          budgetApi.util.updateQueryData('getBudget', purchase.budgetId as string, budgetAsItIsNow => {
            const newPurchases = [...budgetAsItIsNow.purchases]
            newPurchases.unshift({ ...(purchase as Purchase), createdAt: new Date().toISOString(), _id: Math.random().toString() })
            const newTotals = _.cloneDeep(budgetAsItIsNow.totals)
            for (let i = 0; i < newTotals.length; i++) {
              const total = newTotals[i]
              purchase.benefactors?.forEach(benefactor => {
                if (benefactor.user._id === total.user._id) {
                  total.diff = total.diff - benefactor.amountBenefitted
                  total.diff = total.diff + benefactor.amountPaid
                  total.totalBenefitted = total.totalBenefitted + benefactor.amountBenefitted
                  total.totalPaid = total.totalPaid + benefactor.amountPaid
                }
              })
            }
            let newTotal = budgetAsItIsNow.total
            if (purchase.amount) {
              newTotal = newTotal + purchase.amount
            }
            Object.assign(budgetAsItIsNow, {
              purchases: newPurchases,
              totals: newTotals,
              total: newTotal,
            })
          })
        )
        try {
          await foo.queryFulfilled
        } catch (err) {
          patchResult.undo()
        }
      },
    }),
    deletePurchase: builder.mutation<void, { purchaseId: string; budgetId: string }>({
      query: ({ purchaseId }) => ({ url: `/purchases/${purchaseId}`, method: 'DELETE' }),
      invalidatesTags: (result, query, args) => [{ type: 'Budget', id: args.budgetId }],
      async onQueryStarted({ purchaseId, budgetId }, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          budgetApi.util.updateQueryData('getBudget', budgetId, budgetAsItIsNow => {
            const purchaseIndex = budgetAsItIsNow.purchases.findIndex(p => p._id === purchaseId)
            if (purchaseIndex !== -1) {
              const purchase = budgetAsItIsNow.purchases[purchaseIndex]
              const newPurchases = [...budgetAsItIsNow.purchases]
              newPurchases.splice(purchaseIndex, 1)
              const newTotals = _.cloneDeep(budgetAsItIsNow.totals)
              for (let i = 0; i < newTotals.length; i++) {
                const total = newTotals[i]
                purchase.benefactors.forEach(benefactor => {
                  if (benefactor.user._id === total.user._id) {
                    total.diff = total.diff + benefactor.amountBenefitted
                    total.diff = total.diff - benefactor.amountPaid
                    total.totalBenefitted = total.totalBenefitted - benefactor.amountBenefitted
                    total.totalPaid = total.totalPaid - benefactor.amountPaid
                  }
                })
              }
              Object.assign(budgetAsItIsNow, { purchases: newPurchases, totals: newTotals, total: budgetAsItIsNow.total - purchase.amount })
            }
          })
        )
        try {
          await queryFulfilled
        } catch (err) {
          patchResult.undo()
        }
      },
    }),
  }),
})

export const { useCreatePurchaseMutation, useDeletePurchaseMutation } = purchaseApi

export default purchaseApi.reducer
