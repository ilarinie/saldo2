import CloseRounded from '@mui/icons-material/CloseRounded';
import {
  Backdrop,
  Button,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import currency from 'currency.js';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { SaldoModal } from 'src/components/Modal/Modal';
import { UserSelector } from 'src/components/UserSelector/UserSelector';
import { Budget, Purchase, User } from 'src/models/Budget';
import { RootContext } from 'src/state/RootContext';
import { BenefactorEditor } from './BenefactorEditor';
import { initBenefactors } from './initBenefactors';

interface AddPurchaseProps {
  initialPurchase?: Purchase;
  open: boolean;
  onClose: () => void;
  budget: Budget;
  currentUser: User;
}

const StyledTextField = styled(TextField)`
  width: 100%;
`;

export const AddPurchase = observer(
  ({ open, onClose, currentUser, budget }: AddPurchaseProps) => {
    const rootState = useContext(RootContext);

    const [selectedPayerId, setSelectedPayerId] = useState(
      currentUser._id as string
    );
    const [amount, setAmount] = useState(undefined as undefined | number);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const [benefactors, setBenefactors] = useState(
      initBenefactors(
        amount || 0,
        budget.type === 'saldo' ? 'saldo' : 'even-split',
        selectedPayerId,
        budget?.userMap,
        budget?.allIds
      )
    );

    useEffect(() => {
      setBenefactors(
        initBenefactors(
          amount || 0,
          budget.type === 'saldo' ? 'saldo' : 'even-split',
          selectedPayerId,
          budget?.userMap,
          budget?.allIds
        )
      );
    }, [amount, budget, selectedPayerId]);

    const onSave = async () => {
      if (!amount) {
        alert('Summa puuttuu');
        return;
      }
      if (!description) {
        alert('kuvaus puuttuu');
        return;
      }
      setLoading(true);
      await rootState.createPurchase({
        amount,
        description,
        budgetId: budget._id,
        benefactors,
        type: 'purchase',
      });
      setTimeout(() => {
        setLoading(false);
        setAmount(undefined);
        setDescription('');
        setSelectedPayerId(currentUser._id);
        setBenefactors(
          initBenefactors(
            amount || 0,
            budget.type === 'saldo' ? 'saldo' : 'even-split',
            selectedPayerId,
            budget?.userMap,
            budget?.allIds
          )
        );
        onClose();
      }, 1000);
    };
    if (!budget) {
      return null;
    }

    return (
      <SaldoModal open={open} onClose={onClose}>
        <Backdrop open={loading} sx={{ zIndex: 999999 }}>
          <CircularProgress color='inherit' />
        </Backdrop>
        <CardHeader
          title='Add purchase'
          action={
            <IconButton onClick={onClose}>
              <CloseRounded />
            </IconButton>
          }
        />
        <CardContent>
          <StyledTextField
            type='number'
            label='Amount'
            value={amount}
            onChange={(event) =>
              setAmount(currency(event.target.value).value || undefined)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position='start'>€</InputAdornment>
              ),
            }}
          />
          <StyledTextField
            type='text'
            label='Description'
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <Typography variant='h5' gutterBottom sx={{ marginTop: '8px' }}>
            Maksaja
          </Typography>
          {budget.userMap[selectedPayerId] && (
            <UserSelector
              title='Select payer'
              selectedUser={budget.userMap[selectedPayerId]}
              onUserSelected={setSelectedPayerId}
              userIds={budget.allIds}
              userMap={budget.userMap}
            />
          )}
          <Typography variant='h5' gutterBottom sx={{ marginTop: '8px' }}>
            Osuudet
          </Typography>
          <BenefactorEditor
            onDefaultModeChanged={(mode) => {
              setBenefactors(
                initBenefactors(
                  amount || 0,
                  mode,
                  selectedPayerId,
                  budget.userMap,
                  budget.allIds
                )
              );
            }}
            benefactors={benefactors}
            onBenefactorsChanged={setBenefactors}
            total={amount || 0}
          />
        </CardContent>
        <CardActions disableSpacing>
          <Button fullWidth color='info' variant='outlined' onClick={onSave}>
            Save
          </Button>
          <Button color='error' fullWidth variant='outlined' onClick={onClose}>
            Cancel
          </Button>
        </CardActions>
      </SaldoModal>
    );
  }
);
