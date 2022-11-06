import { configureStore } from '@reduxjs/toolkit'
import { api } from './api'
import authReducer from './authSlice'
import { budgetApi } from './budgetApi'
import { purchaseApi } from './purchaseApi'
import purchaseAutocompleteOptionsReducer from './purchaseAutocompleteOptions'

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    purchaseAutocompleteOptions: purchaseAutocompleteOptionsReducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat([purchaseApi.middleware, budgetApi.middleware]),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
