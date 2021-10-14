import { observer } from 'mobx-react-lite'
import { Budget } from 'types'
import { SaldoBudgetItem } from './BudgetItem/BudgetItem'

interface BudgetListProps {
  budgetIds: string[]
  budgetMap: { [key: string]: Budget }
  requestNewPurchase: (budget: Budget) => void
  requestNewTransfer: (budget: Budget) => void
  onDeletePurchase: (purchaseId: string, budgetId: string) => void
}

export const BudgetList = observer(
  ({ budgetIds, budgetMap, requestNewPurchase, onDeletePurchase, requestNewTransfer }: BudgetListProps) => {
    return (
      <>
        {budgetIds.map(b => (
          <SaldoBudgetItem
            onDeletePurchase={onDeletePurchase}
            requestNewTransfer={requestNewTransfer}
            key={b + budgetMap[b].total}
            budget={budgetMap[b]}
            requestNewPurchase={requestNewPurchase}
          />
        ))}
      </>
    )
  }
)
