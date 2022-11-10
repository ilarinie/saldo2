import { AlertProps } from '@mui/material'
import { Action, createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ToastState {
  isOpen: boolean
  message?: string
  type?: AlertProps['severity']
}

const initialState: ToastState = {
  isOpen: false,
}

export const toastSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToastMessage(state, action: PayloadAction<{ message: string; type: AlertProps['severity'] }>) {
      state.isOpen = true
      state.message = action.payload.message
      state.type = action.payload.type
    },
    closeToast(state) {
      state.isOpen = false
    },
  },
})

export const { setToastMessage, closeToast } = toastSlice.actions

export const toastReducer = toastSlice.reducer
