import { CardContent, Typography } from '@mui/material'
import { PurchaseList } from 'client/components/PurchaseList/PurchaseList'
import { useState } from 'react'
import { Budget, Purchase } from 'types'
import { PurchaseDetailsModal } from './PurchaseDetailsModal'

interface BudgetExpandedProps {
  budget: Budget
}

export const getPayer = (purchase: Purchase) => purchase.benefactors.filter(b => b.amountPaid > 0)[0].user

export const BudgetExpanded = ({ budget }: BudgetExpandedProps) => {
  const [selectedPurchase, setSelectedPurchase] = useState(undefined as undefined | Purchase)
  const modalOpen = Boolean(selectedPurchase)

  return (
    <CardContent>
      <Typography>Latest purchases</Typography>
      <PurchaseList budget={budget} limit={5} />
      <PurchaseDetailsModal {...{ modalOpen, selectedPurchase, setSelectedPurchase }} />
    </CardContent>
  )
}
