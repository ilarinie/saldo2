import { Button } from '@chakra-ui/button';
import { Box, Heading } from '@chakra-ui/layout';
import currency from 'currency.js';
import { Budget, User } from 'src/models/Budget';

interface BudgetItemProps {
  budget: Budget;
  currentUser: User;
  addPurchase: (budget: Budget) => void;
}

const parsePersonalSaldo = (budget: Budget, currentUser: User): number => {
  try {
    return budget.totals.filter((t) => t.user._id === currentUser._id)[0].diff;
  } catch (err) {
    return -99;
  }
};

export const SaldoBudgetItem = ({
  budget,
  currentUser,
  addPurchase,
}: BudgetItemProps) => {
  return (
    <Box className='budget-list-item'>
      <Heading>
        <Button onClick={() => addPurchase(budget)}>Add</Button>
        <Box className='total-row'>
          {budget.totals.map((t, index) => {
            return index === 0 ? (
              <Box>
                <Box className='pic-and-name'>
                  <img src={t.user.picture} alt='' />
                  <Box>{t.user.name}</Box>
                </Box>
                <Box color={t.diff >= 0 ? 'positiveColor' : 'negativeColor'}>
                  {currency(t.diff).value}€
                </Box>
              </Box>
            ) : (
              <Box>
                <Box color={t.diff >= 0 ? 'positiveColor' : 'negativeColor'}>
                  {currency(t.diff).value}€
                </Box>
                <Box className='pic-and-name'>
                  <img src={t.user.picture} alt='' />
                  <Box>{t.user.name}</Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Heading>
    </Box>
  );
};
