import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import { Box } from '@mui/system';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { useHistory } from 'react-router';
import { RootContext } from '../../state/RootContext';

export const AddBudget = observer(() => {
  const history = useHistory();
  const {
    budgetStore: { addBudget },
    showSnackbarMessage,
  } = useContext(RootContext);
  const [name, setName] = useState('');
  const [type, setType] = useState('budget' as 'saldo' | 'budget');

  const onSave = async () => {
    if (name) {
      try {
        await addBudget({ name, type });
        showSnackbarMessage('Budget created', 'info');
        history.push('/');
      } catch (err) {
        showSnackbarMessage('Error creating budget', 'error');
      }
    }
  };

  return (
    <Box>
      <Card>
        <CardHeader title='Add Budget' />
        <CardContent>
          <TextField
            fullWidth
            value={name}
            onChange={(event) => setName(event.target.value)}
            label='Name'
          />
          <Typography variant='subtitle1' gutterBottom>
            Type
          </Typography>
          <Select
            fullWidth
            value={type}
            onChange={(event) =>
              setType(event.target.value as 'saldo' | 'budget')
            }
          >
            <MenuItem value={'budget'}>Budget</MenuItem>
            <MenuItem value={'saldo'}>Saldo</MenuItem>
          </Select>
          <CardActions disableSpacing sx={{ marginTop: '16px' }}>
            <Button fullWidth variant='outlined' color='info' onClick={onSave}>
              Save
            </Button>
            <Button fullWidth variant='outlined' color='error'>
              Cancel
            </Button>
          </CardActions>
        </CardContent>
      </Card>
    </Box>
  );
});
