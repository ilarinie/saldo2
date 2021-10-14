import { Box } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { Budget } from 'types'
import { AddPurchase } from './AddPurchase/AddPurchase'
import { AddTransfer } from './AddTransfer/AddTransfer'
import { BudgetList } from './BudgetList/BudgetList'
import { useGetBudgetsQuery } from '../../store/budgetApi'
import { useAppSelector } from '../../store/hooks'
import { useDeletePurchaseMutation } from '../../store/purchaseApi'

const newPurchaseModalStateInit = {
  open: false,
  budget: undefined as undefined | Budget,
}

export const Dashboard = observer(() => {
  const currentUser = useAppSelector((state) => state.auth.currentUser)

  const { data, isLoading, error } = useGetBudgetsQuery()
  const [deletePurchase] = useDeletePurchaseMutation()

  const [newPurchaseModalState, setNewPurchaseModalState] = useState(newPurchaseModalStateInit)

  const [newTransfereModalState, setNewTransferModalState] = useState(newPurchaseModalStateInit)

  const requestNewTransfer = (budget: Budget) => {
    setNewTransferModalState({
      open: true,
      budget: budget,
    })
  }
  const requestNewPurchase = (budget: Budget) => {
    setNewPurchaseModalState({
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
      {data &&
        <>
          <Box>
            <BudgetList
              budgetIds={data.ids}
              budgetMap={data.map}
              requestNewPurchase={requestNewPurchase}
              requestNewTransfer={requestNewTransfer}
              onDeletePurchase={requestDeletePurchase}
            />
          </Box>
          {newPurchaseModalState.budget && (
            <AddPurchase
              currentUser={currentUser}
              budget={newPurchaseModalState.budget}
              open={newPurchaseModalState.open}
              onClose={() => setNewPurchaseModalState({ ...newPurchaseModalState, open: false })}
            />
          )}
          {newTransfereModalState.budget && (
            <AddTransfer
              currentUser={currentUser}
              budget={newTransfereModalState.budget}
              open={newTransfereModalState.open}
              onClose={() => setNewTransferModalState({ ...newTransfereModalState, open: false })}
            />
          )}
        </>
      }
    </>
  )
})
