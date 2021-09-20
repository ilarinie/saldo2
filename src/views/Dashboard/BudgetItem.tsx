import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  colors,
  Container,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import currency from 'currency.js';
import { memo, useState } from 'react';
import { Budget, UserTotal } from 'src/models/Budget';
import { BudgetExpanded } from './BudgetExpanded';

interface BudgetItemProps {
  budget: Budget;
  requestNewPurchase: (budget: Budget) => void;
  onDeletePurchase: (purchaseId: string, budgetId: string) => void;
}

export const CurrencyFormatOptions = {
  symbol: '€',
  pattern: '# !',
  negativePattern: '- # !',
};

export const CurrencyFormatOptionsWithPlus = {
  ...CurrencyFormatOptions,
  pattern: '+ # !',
};

const formatName = (name: string) => {
  return name.split(' ')[0];
};

const ExpandMore = styled((props: any) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }: { theme: any; expand: any }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export const SaldoBudgetItem = memo(
  ({ budget, requestNewPurchase, onDeletePurchase }: BudgetItemProps) => {
    const [expanded, setExpanded] = useState(false);

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const { totals } = budget;
    const member1 = totals[0];
    const member2 = totals[1];

    return (
      <Card>
        <CardHeader title={budget.name} />
        <CardContent>
          <SaldoStack member1={member1} member2={member2} />

          {/* <BudgetStack members={totals} /> */}
        </CardContent>
        <CardActions disableSpacing>
          <Button
            variant='text'
            size='small'
            onClick={() => requestNewPurchase(budget)}
          >
            Add
          </Button>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label='show more'
          >
            <ExpandMoreIcon />
          </ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout='auto' unmountOnExit>
          <BudgetExpanded budget={budget} deletePurchase={onDeletePurchase} />
        </Collapse>
      </Card>
    );
  },
  (previousProps, newProps) => {
    if (previousProps.budget.total === newProps.budget.total) {
      return false;
    }
    return true;
  }
);

const BudgetStack = ({ members }: { members: UserTotal[] }) => (
  <List>
    {members.map((m) => (
      <ListItem>
        <ListItemAvatar>
          <Avatar src={m.user.picture} />
        </ListItemAvatar>
        <ListItemText
          secondaryTypographyProps={{
            color: m.diff > 0 ? colors.green[500] : colors.red[500],
          }}
          primary={m.user.name}
          secondary={currency(m.diff).format(CurrencyFormatOptionsWithPlus)}
        />
      </ListItem>
    ))}
  </List>
);

const SaldoStack = ({
  member1,
  member2,
}: {
  member1: UserTotal;
  member2: UserTotal;
}) => (
  <Stack direction='row'>
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 0,
        width: '50px',
      }}
    >
      <Avatar src={member1.user.picture} sx={{ marginBottom: '4px' }} />
      <Typography>{formatName(member1.user.name)}</Typography>
    </Container>
    <Container
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexGrow: 1,
        width: '100%',
        justifyContent: 'center',
      }}
    >
      <ArrowLeftIcon
        sx={{
          visibility: member1.diff > 0 ? 'visible' : 'hidden',
        }}
      />
      <Typography variant='bigCurrency'>
        {currency(member1.diff).format(CurrencyFormatOptions)}
      </Typography>
      <ArrowRightIcon
        sx={{
          visibility: member1.diff > 0 ? 'hidden' : 'visible',
        }}
      />
    </Container>
    <Container
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flexGrow: 0,
        width: '50px',
      }}
    >
      <Avatar src={member2.user.picture} sx={{ marginBottom: '4px' }} />
      <Typography>{formatName(member2.user.name)}</Typography>
    </Container>
  </Stack>
);
