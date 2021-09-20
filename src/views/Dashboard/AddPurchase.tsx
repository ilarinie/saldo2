import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import {
  Avatar,
  Backdrop,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  TextField,
  Typography,
} from '@mui/material';
import { styled } from '@mui/system';
import currency from 'currency.js';
import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useMemo, useState } from 'react';
import { Budget, Purchase, User } from 'src/models/Budget';
import { RootContext } from 'src/state/RootContext';
import { BenefactorEditor } from './BenefactorEditor';

interface AddPurchaseProps {
  initialPurchase?: Purchase;
  open: boolean;
  onClose: () => void;
  budget?: Budget;
  currentUser: User;
}
const style = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '99vw',
  height: '99vh',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const initBenefactors = (
  members: User[],
  amount: number,
  defaultMode: 'even-split' | 'saldo',
  payerId: string
): any[] => {
  if (defaultMode === 'saldo' && members.length > 2) {
    return [];
  }

  if (defaultMode === 'saldo') {
    return members.map((m) => {
      return {
        user: m,
        amountPaid: payerId === m._id ? amount : 0,
        amountBenefitted: payerId !== m._id ? amount : 0,
      };
    });
  } else {
    const evenDivided = currency(amount).distribute(members.length);
    return members.map((m, index) => {
      return {
        user: m,
        amountPaid: payerId === m._id ? amount : 0,
        amountBenefitted: evenDivided[index].value,
      };
    });
  }
};

const StyledTextField = styled(TextField)`
  width: 100%;
`;

export const AddPurchase = observer(
  ({ open, onClose, currentUser, budget }: AddPurchaseProps) => {
    const rootState = useContext(RootContext);

    const [userIdArray, userIdMap, allMembers] = useMemo(() => {
      if (!budget || !budget.members) {
        return [[], {} as { [key: string]: User }];
      }
      let newArr: string[] = [];
      let newObj: { [key: string]: User } = {};
      const allMembers = [...budget.members, ...budget.owners];

      allMembers.forEach((m) => {
        newArr.push(m._id);
        newObj[m._id] = m;
      });

      return [newArr, newObj, allMembers];
    }, [budget]);
    const [selectedPayerId, setSelectedPayerId] = useState(
      currentUser._id as string
    );
    const [selectPayerDialogOpen, setSelectPayerDialogOpen] = useState(false);
    const [amount, setAmount] = useState(undefined as undefined | number);
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const [benefactors, setBenefactors] = useState(
      initBenefactors(allMembers || [], amount || 0, 'saldo', selectedPayerId)
    );

    useEffect(() => {
      setBenefactors(
        initBenefactors(allMembers || [], amount || 0, 'saldo', selectedPayerId)
      );
    }, [amount, allMembers, selectedPayerId]);

    const onSave = async () => {
      if (!amount) {
        alert('Summa puuttuu');
        return;
      }
      if (!description) {
        alert('kuvaus puuttuu');
        return;
      }

      const purchase: Partial<Purchase> = {
        benefactors,
        amount,
        budgetId: budget?._id || '',
        description,
      };
      setLoading(true);
      await rootState.createPurchase(
        amount,
        description,
        budget?._id || '',
        selectedPayerId,
        benefactors
      );
      setTimeout(() => {
        setLoading(false);
        setAmount(undefined);
        setDescription('');
        setSelectedPayerId(currentUser._id);
        setBenefactors(
          initBenefactors(
            allMembers || [],
            amount || 0,
            'saldo',
            selectedPayerId
          )
        );
        onClose();
      }, 1000);
    };

    return (
      <Modal open={open} onClose={onClose}>
        <>
          <Backdrop open={loading} sx={{ zIndex: 999999 }}>
            <CircularProgress color='inherit' />
          </Backdrop>

          <Card sx={{ ...style, position: 'absolute' }}>
            <CardHeader title='Lisää' />
            <CardContent>
              <StyledTextField
                type='number'
                label='Summa'
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
                label='Kuvaus'
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <Typography variant='h5' gutterBottom sx={{ marginTop: '8px' }}>
                Maksaja
              </Typography>
              <ListItem
                sx={{ padding: '8px 10px 8px 0' }}
                onClick={() => setSelectPayerDialogOpen(true)}
              >
                {userIdMap[selectedPayerId] && (
                  <>
                    <ListItemAvatar>
                      <Avatar src={userIdMap[selectedPayerId].picture} />
                    </ListItemAvatar>
                    <ListItemText primary={userIdMap[selectedPayerId].name} />
                    <SwapHorizIcon />
                  </>
                )}
              </ListItem>
              <Typography variant='h5' gutterBottom sx={{ marginTop: '8px' }}>
                Osuudet
              </Typography>
              <BenefactorEditor
                benefactors={benefactors}
                onBenefactorsChanged={setBenefactors}
                total={amount || 0}
              />
            </CardContent>
            <SimpleDialog
              open={selectPayerDialogOpen}
              onClose={(id) => {
                setSelectPayerDialogOpen(false);
                setSelectedPayerId(id);
              }}
              userIds={userIdArray}
              userMap={userIdMap}
              selectedValue={selectedPayerId}
            />
            <CardActions disableSpacing>
              <Button
                fullWidth
                color='info'
                variant='outlined'
                onClick={onSave}
              >
                Save
              </Button>
              <Button
                color='error'
                fullWidth
                variant='outlined'
                onClick={onClose}
              >
                Cancel
              </Button>
            </CardActions>
          </Card>
        </>
      </Modal>
    );
  }
);

interface SimpleDialogProps {
  onClose: (userId: string) => void;
  open: boolean;
  userIds: string[];
  userMap: { [key: string]: User };
  selectedValue: string;
}

const SimpleDialog = ({
  open,
  onClose,
  userIds,
  userMap,
  selectedValue,
}: SimpleDialogProps) => {
  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Select payer</DialogTitle>
      <List sx={{ pt: 0 }}>
        {userIds.map((id) => (
          <ListItem button onClick={() => handleListItemClick(id)} key={id}>
            <ListItemAvatar>
              <Avatar src={userMap[id].picture}></Avatar>
            </ListItemAvatar>
            <ListItemText primary={userMap[id].name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
};
