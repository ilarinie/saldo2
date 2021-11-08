import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { formatCurrency } from 'client/utils/formatCurrency'
import _ from 'lodash'
import { Budget, Purchase } from 'types'
import { RootState } from './store'

export interface PurchaseAutocompleteOption {
  label: string
  purchase: Purchase
}

interface PurchaseAutocompleteOptions {
  [budgetId: string]: PurchaseAutocompleteOption[]
}

const initialState: PurchaseAutocompleteOptions = {}

export const createPurchaseOptions = createAsyncThunk('purchaseOptions/generateFromBudgetsStatus', async (budget: Budget) => {
  const { purchases } = budget
  const filteredPurchases: Purchase[] = _.uniqBy(purchases, (purchase: Purchase) => [purchase.description, purchase.amount].join()).filter(
    p => !p.description.includes('Transfer from')
  )

  const options = filteredPurchases.map(p => ({
    label: `${p.description} - ${formatCurrency(p.amount)}`,
    purchase: p,
  }))
  return {
    budgetId: budget._id,
    options,
  }
})

export const purchaseAutocompleteOptions = createSlice({
  name: 'purchaseOptions',
  initialState,
  reducers: {
    setPurchaseAutocompleteOptions(state, action: PayloadAction<{ budgetId: string; purchaseOptions: PurchaseAutocompleteOption[] }>) {
      state[action.payload.budgetId] = action.payload.purchaseOptions
    },
  },
  extraReducers: builder => {
    builder.addCase(createPurchaseOptions.fulfilled, (state, action) => {
      state[action.payload.budgetId] = action.payload.options
    })
  },
})

export const selectPurchaseAutocompletionOptions = (budget?: Budget) => (state: RootState) => {
  if (budget) return state.purchaseAutocompleteOptions[budget._id]
  return []
}

export default purchaseAutocompleteOptions.reducer
