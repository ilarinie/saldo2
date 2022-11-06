import { selectCurrentUser } from 'client/store/authSlice'
import { useLazyGetBudgetQuery } from 'client/store/budgetApi'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router'

export const useBudgetViewData = (budgetId: string) => {
  const [trigger, result] = useLazyGetBudgetQuery()
  const history = useHistory()
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    trigger(budgetId)
  }, [])

  return { budget: result.currentData, history, currentUser, trigger }
}
