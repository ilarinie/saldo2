import { Avatar, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { PurchaseUser } from 'server/types';

interface UserListItemProps {
  user: PurchaseUser;
  primary?: string;
  secondary?: string;
  onClick: (user?: PurchaseUser) => void;
  icon?: JSX.Element;
}

export const UserListItem = ({
  user,
  primary,
  secondary,
  onClick,
  icon,
}: UserListItemProps) => {
  return (
    <ListItem sx={{ padding: '8px 10px 8px 0' }} onClick={() => onClick(user)}>
      <>
        <ListItemAvatar>
          <Avatar src={user.picture} />
        </ListItemAvatar>
        <ListItemText
          primary={primary ? primary : user.name}
          secondary={secondary ? secondary : ''}
        />
        {icon && icon}
      </>
    </ListItem>
  );
};
