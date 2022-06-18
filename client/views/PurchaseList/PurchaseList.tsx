import { Container, List, Typography } from '@mui/material'
import { useDeletePurchaseMutation } from 'client/store/purchaseApi'
import { useState } from 'react'
import { Budget, Purchase, PurchaseUser } from 'types'
import { PurchaseDetailsModal } from '../Dashboard/BudgetList/BudgetItem/PurchaseDetailsModal'
import { PurchaseItem } from '../Dashboard/BudgetList/BudgetItem/PurchaseItem'

type PurchaseListProps = {
  budget: Budget
  currentUser: PurchaseUser
}

export const PurchaseList = ({ budget, currentUser }: PurchaseListProps) => {
  const [selectedPurchase, setSelectedPurchase] = useState(undefined as undefined | Purchase)
  const [deletePurchase] = useDeletePurchaseMutation()
  const modalOpen = Boolean(selectedPurchase)

  const onDeletePurchase = (purchaseId: Purchase['_id']) => {
    deletePurchase({
      purchaseId,
      budgetId: budget._id
    })
  }

  return (
    <>
      <List sx={{ height: '100%', overflowY: 'scroll', paddingBottom: '54px'}}>
        {budget.purchases.map(p => (
          <PurchaseItem purchase={p} key={p._id} deletePurchase={onDeletePurchase} onPurchaseSelected={setSelectedPurchase} />
        ))}
      </List>
      <PurchaseDetailsModal {...{ modalOpen, selectedPurchase, setSelectedPurchase }} />
    </>
  )
}
