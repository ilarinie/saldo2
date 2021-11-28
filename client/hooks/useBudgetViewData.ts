import { selectCurrentUser } from 'client/store/authSlice'
import { useGetBudgetsQuery } from 'client/store/budgetApi'
import { useSelector } from 'react-redux'
import { useHistory, useRouteMatch } from 'react-router'

export const useBudgetViewData = () => {
  const match = useRouteMatch<{ budgetId: string }>('/budgets/:budgetId')
  const budget = useGetBudgetsQuery().data?.map[match?.params.budgetId || '']
  const history = useHistory()
  const currentUser = useSelector(selectCurrentUser)

  return { budget, history, currentUser }
}
