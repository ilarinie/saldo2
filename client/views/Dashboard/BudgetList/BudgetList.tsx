import { Budget, PurchaseUser } from 'types'
import { BudgetItem } from './BudgetItem/BudgetItem'

interface BudgetListProps {
  budgetIds: string[]
  budgetMap: { [key: string]: Budget }
  requestNewTransfer: (budget: Budget) => void
  onDeletePurchase: (purchaseId: string, budgetId: string) => void
  currentUser: PurchaseUser
}

export const BudgetList = ({ budgetIds, budgetMap, onDeletePurchase, requestNewTransfer, currentUser }: BudgetListProps) => {
  return (
    <>
      {budgetIds.map(b => (
        <BudgetItem
          currentUser={currentUser}
          onDeletePurchase={onDeletePurchase}
          requestNewTransfer={requestNewTransfer}
          key={b + budgetMap[b].total}
          budget={budgetMap[b]}
        />
      ))}
    </>
  )
}
