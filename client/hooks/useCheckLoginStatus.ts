import { unwrapResult } from '@reduxjs/toolkit'
import { checkCurrentUser, selectLoginStatus, setCurrentUser, setLoginStatus } from 'client/store/authSlice'
import { useAppDispatch } from 'client/store/hooks'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { PurchaseUser } from 'types'

export const useCheckLoginStatus = () => {
  const dispatch = useAppDispatch()
  const loginStatus = useSelector(selectLoginStatus)

  useEffect(() => {
    const checkForLogin = async () => {
      dispatch(setLoginStatus('PENDING'))
      try {
        const resultAction = await dispatch(checkCurrentUser())
        const originalPromiseResult = unwrapResult(resultAction)
        dispatch(setCurrentUser((originalPromiseResult as any).payload as PurchaseUser))
        dispatch(setLoginStatus('LOGGED_IN'))
      } catch (err) {
        dispatch(setLoginStatus('UNAUTHORIZED'))
      }
    }
    checkForLogin()
  }, [])

  return loginStatus
}
