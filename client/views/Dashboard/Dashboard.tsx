import { Box } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Budget } from 'types'
import { useGetBudgetsQuery } from '../../store/budgetApi'
import { useAppSelector } from '../../store/hooks'
import { useDeletePurchaseMutation } from '../../store/purchaseApi'
import { AddTransfer } from './AddTransfer/AddTransfer'
import { BudgetList } from './BudgetList/BudgetList'

const newPurchaseModalStateInit = {
  open: false,
  budget: undefined as undefined | Budget,
}

export const Dashboard = observer(() => {
  const currentUser = useAppSelector(state => state.auth.currentUser)

  const { data, isLoading, error } = useGetBudgetsQuery()
  const [deletePurchase] = useDeletePurchaseMutation()

  const [newTransfereModalState, setNewTransferModalState] = useState(newPurchaseModalStateInit)

  const requestNewTransfer = (budget: Budget) => {
    setNewTransferModalState({
      open: true,
      budget: budget,
    })
  }

  const requestDeletePurchase = (purchaseId: string, budgetId: string) => {
    deletePurchase({ purchaseId, budgetId })
  }

  return (
    <>
      {isLoading && <Box>Loading...</Box>}
      {error && <Box>Could not load budgets...</Box>}
      {data && (
        <>
          <Box>
            <BudgetList
              budgetIds={data.ids}
              budgetMap={data.map}
              requestNewTransfer={requestNewTransfer}
              onDeletePurchase={requestDeletePurchase}
            />
          </Box>
          {newTransfereModalState.budget && (
            <AddTransfer
              currentUser={currentUser}
              budget={newTransfereModalState.budget}
              open={newTransfereModalState.open}
              onClose={() => setNewTransferModalState({ ...newTransfereModalState, open: false })}
            />
          )}
        </>
      )}
    </>
  )
})
