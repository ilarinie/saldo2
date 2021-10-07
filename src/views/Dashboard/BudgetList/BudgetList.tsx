import { observer } from 'mobx-react-lite';
import { BudgetResponse } from 'server/types';
import { SaldoBudgetItem } from './BudgetItem/BudgetItem';

interface BudgetListProps {
  budgetIds: string[];
  budgetMap: { [key: string]: BudgetResponse };
  requestNewPurchase: (budget: BudgetResponse) => void;
  requestNewTransfer: (budget: BudgetResponse) => void;
  onDeletePurchase: (purchaseId: string, budgetId: string) => void;
}

export const BudgetList = observer(
  ({
    budgetIds,
    budgetMap,
    requestNewPurchase,
    onDeletePurchase,
    requestNewTransfer,
  }: BudgetListProps) => {
    console.log('renderss');
    return (
      <>
        {budgetIds.map((b) => (
          <SaldoBudgetItem
            onDeletePurchase={onDeletePurchase}
            requestNewTransfer={requestNewTransfer}
            key={b + budgetMap[b].total}
            budget={budgetMap[b]}
            requestNewPurchase={requestNewPurchase}
          />
        ))}
      </>
    );
  }
);
