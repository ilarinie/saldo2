import { Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { Budget } from '../../models/Budget';
import { RootContext } from '../../state/RootContext';
import { AddPurchase } from './AddPurchase/AddPurchase';
import { AddTransfer } from './AddTransfer/AddTransfer';
import { BudgetList } from './BudgetList/BudgetList';

const newPurchaseModalStateInit = {
  open: false,
  budget: undefined as undefined | Budget,
};

export const Dashboard = observer(() => {
  const {
    budgetStore: { ids: budgetIds, map: budgetMap },
    deletePurchase,
    currentUser,
  } = useContext(RootContext);
  const [newPurchaseModalState, setNewPurchaseModalState] = useState(
    newPurchaseModalStateInit
  );

  const [newTransfereModalState, setNewTransferModalState] = useState(
    newPurchaseModalStateInit
  );

  const requestNewTransfer = (budget: Budget) => {
    setNewTransferModalState({
      open: true,
      budget: budget,
    });
  };
  const requestNewPurchase = (budget: Budget) => {
    setNewPurchaseModalState({
      open: true,
      budget: budget,
    });
  };

  const requestDeletePurchase = (purchaseId: string, budgetId: string) => {
    deletePurchase(purchaseId, budgetId);
  };

  return (
    <>
      <Box>
        <BudgetList
          budgetIds={budgetIds}
          budgetMap={budgetMap}
          requestNewPurchase={requestNewPurchase}
          requestNewTransfer={requestNewTransfer}
          onDeletePurchase={requestDeletePurchase}
        />
      </Box>
      {newPurchaseModalState.budget && (
        <AddPurchase
          currentUser={currentUser}
          budget={newPurchaseModalState.budget}
          open={newPurchaseModalState.open}
          onClose={() =>
            setNewPurchaseModalState({ ...newPurchaseModalState, open: false })
          }
        />
      )}
      {newTransfereModalState.budget && (
        <AddTransfer
          currentUser={currentUser}
          budget={newTransfereModalState.budget}
          open={newTransfereModalState.open}
          onClose={() =>
            setNewTransferModalState({ ...newTransfereModalState, open: false })
          }
        />
      )}
    </>
  );
});
