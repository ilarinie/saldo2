import { observer } from 'mobx-react-lite'
import { Budget } from 'types'
import { BudgetItem } from './BudgetItem/BudgetItem'

interface BudgetListProps {
  budgetIds: string[]
  budgetMap: { [key: string]: Budget }
  requestNewTransfer: (budget: Budget) => void
  onDeletePurchase: (purchaseId: string, budgetId: string) => void
}

export const BudgetList = observer(({ budgetIds, budgetMap, onDeletePurchase, requestNewTransfer }: BudgetListProps) => {
  return (
    <>
      {budgetIds.map(b => (
        <BudgetItem
          onDeletePurchase={onDeletePurchase}
          requestNewTransfer={requestNewTransfer}
          key={b + budgetMap[b].total}
          budget={budgetMap[b]}
        />
      ))}
    </>
  )
})
