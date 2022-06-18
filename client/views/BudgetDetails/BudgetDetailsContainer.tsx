import { Container } from '@mui/material'
import { styled } from '@mui/system'
import { LoadingBox } from 'client/components'
import { useBudgetViewData } from 'client/hooks/useBudgetViewData'
import { useState } from 'react'
import { Budget } from 'types'
import { AddPurchase } from '../AddPurchase/AddPurchase'
import { BudgetReport } from '../BudgetReport/BudgetReport'
import { PurchaseList } from '../PurchaseList/PurchaseList'
import { BudgetDetailsBottomBar } from './BudgetDefailsBottomBar'
import { BudgetDetailsView } from './BudgetDetailsView'

export const BudgetDetailsContainer = () => {
  const { budget, currentUser } = useBudgetViewData()
  const [selectedIndex, setSelectedIndex] = useState(0)

  const renderTab = () => {
    switch (selectedIndex) {
      case 0:
        return <BudgetDetailsView budget={budget as Budget} currentUser={currentUser} />
      case 1:
        return (
          <AddPurchase
            budget={budget as Budget}
            currentUser={currentUser}
            onCancel={() => setSelectedIndex(0)}
            onPurchaseCreated={() => setSelectedIndex(0)}
          />
        )
      case 2:
        return <PurchaseList budget={budget as Budget} currentUser={currentUser} />
      case 3:
        return <BudgetReport budget={budget as Budget} />
      default:
        return null
    }
  }

  return (
    <Container sx={{ height: '100%', padding: 0, paddingBottom: '54px'}}>
      {budget ? renderTab() : <LoadingBox isLoading={!budget} error='' />}
      <BudgetDetailsBottomBar selectedIndex={selectedIndex} setSelectedIndex={setSelectedIndex} />
    </Container>
  )
}
