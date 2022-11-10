import { Collapse, List } from '@mui/material'
import { useDeletePurchaseMutation } from 'client/store/purchaseApi'
import { TransitionGroup } from 'react-transition-group'
import { useState } from 'react'
import { Budget, Purchase, PurchaseUser } from 'types'
import { PurchaseDetailsModal } from '../../views/Dashboard/BudgetList/BudgetItem/PurchaseDetailsModal'
import { PurchaseItem } from '..'

type PurchaseListProps = {
  budget: Budget
  limit?: number
  currentUser: PurchaseUser
}

export const PurchaseList = ({ budget, limit, currentUser }: PurchaseListProps) => {
  const [selectedPurchase, setSelectedPurchase] = useState(undefined as undefined | Purchase)
  const [deletePurchase] = useDeletePurchaseMutation()
  const modalOpen = Boolean(selectedPurchase)

  const onDeletePurchase = (purchaseId: Purchase['_id']) => {
    deletePurchase({
      purchaseId,
      budgetId: budget._id,
    })
  }

  return (
    <>
      <List sx={{ height: '100%', overflowY: 'scroll', paddingBottom: '54px' }}>
        <TransitionGroup>
          {budget.purchases.slice(0, limit ? limit : budget.purchases.length).map(p => (
            <Collapse key={p.purchaseId}>
              <PurchaseItem
                currentUser={currentUser}
                purchase={p}
                key={p._id}
                deletePurchase={onDeletePurchase}
                onPurchaseSelected={setSelectedPurchase}
              />
            </Collapse>
          ))}
        </TransitionGroup>
      </List>
      <PurchaseDetailsModal {...{ modalOpen, selectedPurchase, setSelectedPurchase }} />
    </>
  )
}
