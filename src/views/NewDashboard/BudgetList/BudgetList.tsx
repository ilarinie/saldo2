import { Box } from '@chakra-ui/layout';
import { Budget } from 'src/models/Budget';
import { SaldoBudgetItem } from './SaldoBudgetItem';

interface BudgetListProps {
  budgets: Budget[];
  currentUser: any;
  addPurchase: (budget: Budget) => void;
}

export const BudgetList = ({
  budgets,
  currentUser,
  addPurchase,
}: BudgetListProps) => {
  return (
    <Box className='budget-list'>
      {budgets.map((b) =>
        b.type === 'saldo' ? (
          <SaldoBudgetItem
            key={b._id}
            budget={b}
            currentUser={currentUser}
            addPurchase={addPurchase}
          />
        ) : null
      )}
    </Box>
  );
};
