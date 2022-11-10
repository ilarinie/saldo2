import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { PurchaseUser, ResponseType } from '../../types'
import axios, { AxiosError } from 'axios'
import { setToastMessage } from './toastSlice'

export type AuthStatus = 'PENDING' | 'UNAUTHORIZED' | 'LOGGED_IN'

interface AuthState {
  currentUser: PurchaseUser
  status: 'PENDING' | 'UNAUTHORIZED' | 'LOGGED_IN'
}

const initialState: AuthState = {
  currentUser: {
    _id: '',
    name: '',
    picture: '',
    defaultBudgetId: '',
  },
  status: 'PENDING',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action: PayloadAction<PurchaseUser>) {
      state.currentUser = action.payload
    },
    setLoginStatus(state, action: PayloadAction<AuthStatus>) {
      state.status = action.payload
    },
  },
})

export const checkCurrentUser = createAsyncThunk('auth/tryLogin', async (_, { dispatch }) => {
  try {
    const { data } = await axios.get<ResponseType<PurchaseUser>>('/api/auth/checklogin')
    return data
  } catch (err: unknown | AxiosError) {
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 500) {
        dispatch(setToastMessage({ message: 'Server issue, try again later', type: 'error' }))
      } else {
        dispatch(setToastMessage({ message: 'Please log in', type: 'success' }))
      }
    }
    return Promise.reject('not logged in')
  }
})

export const { setCurrentUser, setLoginStatus } = authSlice.actions

export const selectCurrentUser = (state: RootState) => state.auth.currentUser
export const selectLoginStatus = (state: RootState) => state.auth.status

export default authSlice.reducer
