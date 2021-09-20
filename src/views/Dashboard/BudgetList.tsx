import { observer } from 'mobx-react-lite';
import { Budget } from 'src/models/Budget';
import { SaldoBudgetItem } from './BudgetItem';

interface BudgetListProps {
  budgetIds: string[];
  budgetMap: { [key: string]: Budget };
  requestNewPurchase: (budget: Budget) => void;
  onDeletePurchase: (purchaseId: string, budgetId: string) => void;
}

export const BudgetList = observer(
  ({
    budgetIds,
    budgetMap,
    requestNewPurchase,
    onDeletePurchase,
  }: BudgetListProps) => {
    console.log('renderss');
    return (
      <>
        {budgetIds.map((b) => (
          <SaldoBudgetItem
            onDeletePurchase={onDeletePurchase}
            key={b + budgetMap[b].total}
            budget={budgetMap[b]}
            requestNewPurchase={requestNewPurchase}
          />
        ))}
      </>
    );
  }
);
