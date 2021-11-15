import { Box, Button, Card, CardContent, List, ListItem, ListItemText, Paper, TextField, Typography } from '@mui/material'
import { useState } from 'react'
import { useRouteMatch } from 'react-router'
import { Budget } from 'types'
import { useAddBudgetUserMutation, useGetBudgetsQuery } from '../../store/budgetApi'

export const AddBudgetUser = () => {
  const match = useRouteMatch<{ budgetId: string }>('/budgets/:budgetId/adduser')
  const budget = useGetBudgetsQuery().data?.map[match?.params.budgetId || ''] as Budget
  const [newUserName, setNewUserName] = useState('')

  const validuserName = (username: string) => {
    if (username === '') {
      return false
    }
    for (let i = 0; i < budget.allIds.length; i++) {
      if (budget.userMap[budget.allIds[i]].name === username) {
        return false
      }
    }
    return true
  }

  const [addBudgetUser] = useAddBudgetUserMutation()

  const onAddUser = () => {
    if (validuserName(newUserName)) {
      addBudgetUser({ budgetId: budget._id, username: newUserName })
    }
  }

  if (!budget) {
    return null
  }

  return (
    <Paper>
      <Typography variant='h2'> Add Users to</Typography>
      {budget.name}
      <Card>
        <CardContent>
          <List>
            {budget.allIds.map((m: string) => (
              <ListItem key={m}>
                <ListItemText primary={budget.userMap[m].name} />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex' }}>
            <TextField
              fullWidth
              value={newUserName}
              onChange={event => setNewUserName(event.target.value)}
              label='Add user'
              error={!validuserName(newUserName)}
              helperText={!validuserName(newUserName) && 'Username already in use'}
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
  )
}
