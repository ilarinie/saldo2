import { Box, Container, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { Budget } from 'src/models/Budget';
import { RootContext } from 'src/state/RootContext';
import { AddPurchase } from './AddPurchase';
import { BudgetList } from './BudgetList';

const newPurchaseModalStateInit = {
  open: false,
  budget: undefined as undefined | Budget,
};

export const Dashboard = observer(() => {
  const rootState = useContext(RootContext);
  const [newPurchaseModalState, setNewPurchaseModalState] = useState(
    newPurchaseModalStateInit
  );

  const requestNewPurchase = (budget: Budget) => {
    // rootState.showSnackbarMessage('info', 'muu');
    setNewPurchaseModalState({
      open: true,
      budget: budget,
    });
  };

  const requestDeletePurchase = (purchaseId: string, budgetId: string) => {
    rootState.deletePurchase(purchaseId, budgetId);
  };

  return (
    <>
      <Container maxWidth='lg'>
        <Box>
          <Typography variant='h2' gutterBottom>
            Saldo
          </Typography>
        </Box>
        <Box>
          <BudgetList
            budgetIds={rootState.budgetIds}
            budgetMap={rootState.budgetMap}
            requestNewPurchase={requestNewPurchase}
            onDeletePurchase={requestDeletePurchase}
          />
        </Box>
      </Container>
      <AddPurchase
        currentUser={rootState.currentUser}
        budget={newPurchaseModalState.budget}
        open={newPurchaseModalState.open}
        onClose={() =>
          setNewPurchaseModalState({ ...newPurchaseModalState, open: false })
        }
      />
    </>
  );
});
