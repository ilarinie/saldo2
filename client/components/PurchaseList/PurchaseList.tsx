import { List } from '@mui/material'
import { useDeletePurchaseMutation } from 'client/store/purchaseApi'
import { useState } from 'react'
import { Budget, Purchase } from 'types'
import { PurchaseDetailsModal } from '../../views/Dashboard/BudgetList/BudgetItem/PurchaseDetailsModal'
import { PurchaseItem } from '..'

type PurchaseListProps = {
  budget: Budget
  limit?: number
}

export const PurchaseList = ({ budget, limit }: PurchaseListProps) => {
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
        {budget.purchases.slice(0, limit ? limit : budget.purchases.length).map(p => (
          <PurchaseItem purchase={p} key={p._id} deletePurchase={onDeletePurchase} onPurchaseSelected={setSelectedPurchase} />
        ))}
      </List>
      <PurchaseDetailsModal {...{ modalOpen, selectedPurchase, setSelectedPurchase }} />
    </>
  )
}
