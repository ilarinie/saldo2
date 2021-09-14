import { Button } from '@chakra-ui/button';
import { Box, Heading } from '@chakra-ui/layout';
import { Budget, User } from 'src/models/Budget';

interface BudgetItemProps {
  budget: Budget;
  currentUser: User;
  addPurchase: (budget: Budget) => void;
}

const parsePersonalSaldo = (budget: Budget, currentUser: User): number => {
  try {
    return budget.totals.filter((t) => t.user._id === currentUser._id)[0].saldo;
  } catch (err) {
    return -99;
  }
};

export const BudgetItem = ({
  budget,
  currentUser,
  addPurchase,
}: BudgetItemProps) => {
  return (
    <Box className='budget-list-item'>
      <Heading>
        {budget.name}
        <Button onClick={() => addPurchase(budget)}>Add</Button>
        {budget.totals.map((t) => (
          <Box className='total-row'>
            <Box className='pic-and-name'>
              <img src={t.user.picture} alt='' />
              <Box>{t.user.name}</Box>
            </Box>
            <Box color={t.saldo >= 0 ? 'positiveColor' : 'negativeColor'}>
              {t.saldo}€
            </Box>
          </Box>
        ))}
      </Heading>
    </Box>
  );
};
