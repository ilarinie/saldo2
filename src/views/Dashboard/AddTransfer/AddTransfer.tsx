import CloseRounded from '@mui/icons-material/CloseRounded';
import {
  Button,
  CardActions,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import currency from 'currency.js';
import { useContext, useState } from 'react';
import { Benefactor, BudgetResponse, PurchaseUser } from 'server/types';
import { SaldoModal } from '../../../components/Modal/Modal';
import { UserSelector } from '../../../components/UserSelector/UserSelector';
import { RootContext } from '../../../state/RootContext';
import { CurrencyFormatOptions } from '../BudgetList/BudgetItem/BudgetItem';

interface AddTransferProps {
  budget: BudgetResponse;
  open: boolean;
  onClose: () => void;
  currentUser: PurchaseUser;
}

const generateBenefactors = (
  budget: BudgetResponse,
  payerId: string,
  receiverId: string,
  amount: number
): Benefactor[] =>
  budget.allIds.map((b) => ({
    user: budget.userMap[b],
    amountBenefitted: b === receiverId ? amount : 0,
    amountPaid: b === payerId ? amount : 0,
  }));

interface NewTransferState {
  selectedPayer: string;
  selectedReceiver: string;
  amount: number | undefined;
  selectableReceivers: string[];
}

export const AddTransfer = ({
  budget,
  open,
  onClose,
  currentUser,
}: AddTransferProps) => {
  const rootState = useContext(RootContext);
  const [
    { selectedPayer, selectedReceiver, amount, selectableReceivers },
    setNewTransferState,
  ] = useState<NewTransferState>({
    selectedPayer: currentUser._id,
    selectedReceiver:
      budget?.allIds[0] === currentUser._id
        ? budget.allIds[1] || budget.allIds[0]
        : budget.allIds[0],
    amount: undefined,
    selectableReceivers: [],
  });

  const onPayerChange = (newPayerId: string) => {
    const newSelectableReceivers = budget.allIds.filter(
      (s) => s !== newPayerId
    );
    let newReceiverId = selectedReceiver;
    if (newPayerId === selectedReceiver) {
      newReceiverId = newSelectableReceivers[0];
    }
    setNewTransferState({
      amount,
      selectedReceiver: newReceiverId,
      selectedPayer: newPayerId,
      selectableReceivers: newSelectableReceivers,
    });
  };

  const onSave = async () => {
    if (amount === undefined) {
      return;
    }

    const benefactors = generateBenefactors(
      budget,
      selectedPayer,
      selectedReceiver,
      amount
    );
    await rootState.createPurchase({
      amount,
      description: `Transfer from ${
        budget.userMap[selectedPayer].name.split(' ')[0]
      } to ${budget.userMap[selectedReceiver].name.split(' ')[0]}`,
      budgetId: budget._id,
      benefactors,
      type: 'purchase',
    });
  };

  return (
    <SaldoModal open={open} onClose={onClose}>
      <CardHeader
        title='New Transfer'
        action={
          <IconButton onClick={onClose}>
            <CloseRounded />
          </IconButton>
        }
      />
      <CardContent>
        <TextField
          type='number'
          value={amount}
          fullWidth
          label='Amount'
          onChange={(event) =>
            setNewTransferState({
              selectedReceiver,
              selectedPayer,
              selectableReceivers,
              amount: currency(event.target.value).value || undefined,
            })
          }
          InputProps={{
            startAdornment: <InputAdornment position='start'>€</InputAdornment>,
          }}
        />
        <Typography variant='subtitle1'>Payer</Typography>
        <UserSelector
          title='Select payer'
          selectedUser={budget.userMap[selectedPayer]}
          userIds={budget.allIds}
          userMap={budget.userMap}
          onUserSelected={onPayerChange}
        />
        <Typography variant='subtitle1'>Receiver</Typography>
        <UserSelector
          title='Select receiver'
          selectedUser={budget.userMap[selectedReceiver]}
          userIds={selectableReceivers}
          userMap={budget.userMap}
          onUserSelected={(id) =>
            setNewTransferState({
              selectedPayer,
              amount,
              selectableReceivers,
              selectedReceiver: id,
            })
          }
        />
        <Typography
          sx={{ marginTop: '8px' }}
          variant='caption'
        >{`Tranfer ${currency(amount || 0).format(
          CurrencyFormatOptions
        )} from ${budget.userMap[selectedPayer].name} to ${
          budget.userMap[selectedReceiver].name
        }`}</Typography>
        <CardActions disableSpacing sx={{ marginTop: '16px' }}>
          <Button fullWidth variant='outlined' color='info' onClick={onSave}>
            Save
          </Button>
          <Button color='error' fullWidth variant='outlined' onClick={onClose}>
            Cancel
          </Button>
        </CardActions>
      </CardContent>
    </SaldoModal>
  );
};
