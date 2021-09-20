import DeleteIcon from '@mui/icons-material/DeleteForever';
import {
  Avatar,
  CardContent,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from '@mui/material';
import currency from 'currency.js';
import { Budget, Purchase } from 'src/models/Budget';
import { CurrencyFormatOptions } from './BudgetItem';

interface BudgetExpandedProps {
  budget: Budget;
  deletePurchase: (purchaseId: string, budgetId: string) => void;
}

export const BudgetExpanded = ({
  budget,
  deletePurchase,
}: BudgetExpandedProps) => {
  return (
    <CardContent>
      <Typography>Latest purchases</Typography>
      <List>
        {budget.purchases.slice(0, 5).map((p) => (
          <PurchaseItem
            purchase={p}
            key={p._id}
            deletePurchase={deletePurchase}
          />
        ))}
      </List>
    </CardContent>
  );
};

const PurchaseItem = ({
  purchase,
  deletePurchase,
}: {
  purchase: Purchase;
  deletePurchase: (purchaseId: string, budgetId: string) => void;
}) => {
  const payer = purchase.benefactors.filter((b) => b.amountPaid > 0)[0].user;

  const onDeletePurchase = () => {
    /* eslint-disable */
    const duu = confirm('Sure u want delete?');
    if (duu) {
      deletePurchase(purchase._id, purchase.budgetId);
    }
  };

  return (
    <ListItem
      secondaryAction={
        <IconButton edge='end' aria-label='delete' onClick={onDeletePurchase}>
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemAvatar>
        <Avatar src={payer.picture} />
      </ListItemAvatar>
      <ListItemText
        primary={purchase.description}
        secondary={`${currency(purchase.amount).format(
          CurrencyFormatOptions
        )} - ${new Date(purchase.createdAt).toLocaleTimeString()}`}
      />
    </ListItem>
  );
};
