import {
  Box,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useContext, useState } from 'react';
import { useRouteMatch } from 'react-router';
import { RootContext } from 'src/state/RootContext';

export const AddBudgetUser = observer(() => {
  const rootState = useContext(RootContext);
  let match = useRouteMatch<{ budgetId: string }>('/budgets/:budgetId/adduser');
  const budget = rootState.budgetStore.map[match?.params.budgetId as string];
  const [newUserName, setNewUserName] = useState('');

  const validuserName = (username: string) => {
    if (username === '') {
      return false;
    }
    for (let i = 0; i < budget.allIds.length; i++) {
      if (budget.userMap[budget.allIds[i]].name === username) {
        return false;
      }
    }
    return true;
  };

  const onAddUser = () => {
    if (validuserName(newUserName)) {
      rootState.addUser(budget, newUserName);
    }
  };

  if (!budget) {
    return null;
  }

  return (
    <Paper>
      <Typography variant='h2'> Add Users to</Typography>
      {budget.name}
      <Card>
        <CardContent>
          <List>
            {budget.allIds.map((m) => (
              <ListItem key={m}>
                <ListItemText primary={budget.userMap[m].name} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              value={newUserName}
              onChange={(event) => setNewUserName(event.target.value.trim())}
              label='Add user'
              error={!validuserName(newUserName)}
              helperText={
                !validuserName(newUserName) && 'Username already in use'
              }
            />
            <Button
              onClick={onAddUser}
              disabled={!validuserName(newUserName)}
              sx={{
                width: '25%',
              }}
              variant='outlined'
              fullWidth
            >
              Add
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Paper>
  );
});
