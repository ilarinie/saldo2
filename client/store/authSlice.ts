import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'
import { PurchaseUser, ResponseType } from '../../types'
import axios from 'axios'

export type AuthStatus = 'PENDING' | 'UNAUTHORIZED' | 'LOGGED_IN'

interface AuthState {
    currentUser: PurchaseUser
    status: 'PENDING' | 'UNAUTHORIZED' | 'LOGGED_IN'
}

const initialState: AuthState = {
    currentUser: {
        _id: '',
        name: '',
        picture: ''
    },
    status: 'PENDING'
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
        }
    },
})

export const checkCurrentUser = createAsyncThunk(
    'auth/tryLogin',
    async () => {
        try {
            const { data } = await axios.get<ResponseType<PurchaseUser>>('/api/auth/checklogin')
            return data
        } catch (err) {
            return Promise.reject('not logged in')
        }
    }
)

export const { setCurrentUser, setLoginStatus } = authSlice.actions

export const selectCurrentUser = (state: RootState) => state.auth.currentUser
export const selectLoginStatus = (state: RootState) => state.auth.status

export default authSlice.reducer
