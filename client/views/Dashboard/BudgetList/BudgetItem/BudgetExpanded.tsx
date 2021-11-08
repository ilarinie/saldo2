import { CardContent, List, Typography } from '@mui/material'
import { useState } from 'react'
import { Budget, Purchase } from 'types'
import { PurchaseDetailsModal } from './PurchaseDetailsModal'
import { PurchaseItem } from './PurchaseItem'

interface BudgetExpandedProps {
  budget: Budget
  deletePurchase: (purchaseId: string, budgetId: string) => void
}

export const getPayer = (purchase: Purchase) => purchase.benefactors.filter(b => b.amountPaid > 0)[0].user

export const BudgetExpanded = ({ budget, deletePurchase }: BudgetExpandedProps) => {
  const [selectedPurchase, setSelectedPurchase] = useState(undefined as undefined | Purchase)
  const modalOpen = Boolean(selectedPurchase)

  return (
    <CardContent>
      <Typography>Latest purchases</Typography>
      <List>
        {budget.purchases.slice(0, 5).map(p => (
          <PurchaseItem purchase={p} key={p._id} deletePurchase={deletePurchase} onPurchaseSelected={setSelectedPurchase} />
        ))}
      </List>
      <PurchaseDetailsModal {...{ modalOpen, selectedPurchase, setSelectedPurchase }} />
    </CardContent>
  )
}
