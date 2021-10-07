import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
  Avatar,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@mui/material';
import currency from 'currency.js';
import { useState } from 'react';
import { BudgetResponse, Purchase } from 'server/types';
import { CurrencyFormatOptions } from './BudgetItem';

interface BudgetExpandedProps {
  budget: BudgetResponse;
  deletePurchase: (purchaseId: string, budgetId: string) => void;
}

const getPayer = (purchase: Purchase) =>
  purchase.benefactors.filter((b) => b.amountPaid > 0)[0].user;

const style = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '600px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const BudgetExpanded = ({
  budget,
  deletePurchase,
}: BudgetExpandedProps) => {
  const [selectedPurchase, setSelectedPurcase] = useState(
    undefined as undefined | Purchase
  );
  const modalOpen = Boolean(selectedPurchase);

  return (
    <CardContent>
      <Typography>Latest purchases</Typography>
      <List>
        {budget.purchases.slice(0, 5).map((p) => (
          <PurchaseItem
            purchase={p}
            key={p._id}
            deletePurchase={deletePurchase}
            onPurchaseSelected={setSelectedPurcase}
          />
        ))}
      </List>
      <Modal open={modalOpen} onClose={() => setSelectedPurcase(undefined)}>
        <Card sx={{ ...style, position: 'absolute' }}>
          {selectedPurchase && (
            <>
              <CardHeader
                title={selectedPurchase?.description}
                avatar={
                  <Avatar
                    src={getPayer(selectedPurchase).picture}
                    aria-label='recipe'
                  />
                }
                subheader={formatDateTime(new Date(selectedPurchase.createdAt))}
                action={
                  <IconButton
                    aria-label='close'
                    onClick={() => setSelectedPurcase(undefined)}
                  >
                    <CloseRoundedIcon />
                  </IconButton>
                }
              />
              <CardContent>
                <Typography variant='subtitle1'>Summa</Typography>
                <Typography variant='bigCurrency'>
                  {currency(selectedPurchase.amount).format(
                    CurrencyFormatOptions
                  )}
                </Typography>
                <Typography sx={{ marginTop: '0.5em' }} variant='subtitle1'>
                  Osuudet
                </Typography>
                <Table aria-label='equity table'>
                  <TableBody>
                    {selectedPurchase.benefactors.map((benefactor) => (
                      <TableRow
                        key={benefactor.user._id}
                        sx={{
                          '&:last-child td, &:last-child th': { border: 0 },
                        }}
                      >
                        <TableCell component='th' scope='row'>
                          {benefactor.user.name.split(' ')[0]}
                        </TableCell>
                        <TableCell align='right'>
                          {currency(benefactor.amountBenefitted).format(
                            CurrencyFormatOptions
                          )}
                        </TableCell>
                        <TableCell align='right'>
                          {percentage(
                            benefactor.amountBenefitted,
                            selectedPurchase.amount
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Typography sx={{ marginTop: '0.5em' }} variant='subtitle1'>
                  Ostoksen loi
                </Typography>
                <Typography sx={{ marginTop: '0.5em' }} variant='body2'>
                  {selectedPurchase.createdBy.name}
                </Typography>
              </CardContent>
            </>
          )}
        </Card>
      </Modal>
    </CardContent>
  );
};

const percentage = (number1: number, number2: number): string => {
  return ((number1 / number2) * 100).toFixed(0) + '%';
};

const formatDateTime = (date: Date): string => {
  return `${date.toLocaleDateString()} - ${date.toLocaleTimeString()}`;
};

const PurchaseItem = ({
  purchase,
  deletePurchase,
  onPurchaseSelected,
}: {
  purchase: Purchase;
  deletePurchase: (purchaseId: string, budgetId: string) => void;
  onPurchaseSelected: (purchase: Purchase) => void;
}) => {
  const onDeletePurchase = () => {
    /* eslint-disable */
    const duu = confirm('Sure u want delete?');
    if (duu) {
      deletePurchase(purchase._id, purchase.budgetId);
    }
    onMenuClose();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const onMenuOpen = (event: any) => {
    setAnchorEl(event.target);
  };

  const onMenuClose = (action?: any) => {
    setAnchorEl(null);
    if (action) {
      if (action === 'open') {
        onPurchaseSelected(purchase);
      }
    }
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton edge='end' aria-label='delete' onClick={onMenuOpen}>
          <MoreVertIcon />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar src={getPayer(purchase).picture} />
      </ListItemAvatar>
      <ListItemText
        primary={purchase.description}
        secondary={`${currency(purchase.amount).format(
          CurrencyFormatOptions
        )} - ${new Date(purchase.createdAt).toLocaleTimeString()}`}
      />
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={onMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => onMenuClose('open')}>
          <ListItemIcon>
            <InfoOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Details</ListItemText>
        </MenuItem>
        <MenuItem onClick={onDeletePurchase}>
          <ListItemIcon>
            <DeleteOutlineOutlinedIcon />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </ListItem>
  );
};
