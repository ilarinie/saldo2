import { configureStore } from '@reduxjs/toolkit'
import { budgetApi } from './budgetApi'
import { purchaseApi } from './purchaseApi'
import authReducer from './authSlice'

export const store = configureStore({
    reducer: {
        [budgetApi.reducerPath]: budgetApi.reducer,
        [purchaseApi.reducerPath]: purchaseApi.reducer,
        auth: authReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat([purchaseApi.middleware, budgetApi.middleware]),
})

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch