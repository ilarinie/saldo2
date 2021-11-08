import { Avatar, colors, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { formatCurrency } from 'client/utils/formatCurrency'
import { UserTotal } from 'types'

export const BudgetStack = ({ members }: { members: UserTotal[] }) => (
  <List>
    {members.map(m => (
      <ListItem key={m.user._id}>
        <ListItemAvatar>
          <Avatar src={m.user.picture} />
        </ListItemAvatar>
        <ListItemText
          secondaryTypographyProps={{
            color: m.diff > 0 ? colors.green[500] : colors.red[500],
          }}
          primary={m.user.name}
          secondary={formatCurrency(m.diff, true)}
        />
      </ListItem>
    ))}
  </List>
)
