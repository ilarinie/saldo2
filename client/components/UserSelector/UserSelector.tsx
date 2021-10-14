import SwapHoriz from '@mui/icons-material/SwapHoriz'
import { Avatar, Dialog, DialogTitle, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material'
import { useState } from 'react'
import { PurchaseUser } from 'types'
import { UserListItem } from '../UserListItem/UserListItem'

interface UserSelectorProps {
  selectedUser: PurchaseUser
  userIds: string[]
  userMap: { [key: string]: PurchaseUser }
  onUserSelected: (userId: string) => void
  title: string
}

export const UserSelector = ({ selectedUser, userIds, userMap, onUserSelected, title }: UserSelectorProps) => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleSelect = (userId: string) => {
    onUserSelected(userId)
    setDialogOpen(false)
  }

  return (
    <>
      <UserListItem user={selectedUser} icon={<SwapHoriz />} onClick={() => setDialogOpen(true)} />
      <SimpleDialog
        title={title}
        selectedValue={selectedUser._id}
        open={dialogOpen}
        onClose={handleSelect}
        userIds={userIds}
        userMap={userMap}
      />
    </>
  )
}

interface SimpleDialogProps {
  onClose: (userId: string) => void
  open: boolean
  userIds: string[]
  userMap: { [key: string]: PurchaseUser }
  selectedValue: string
  title: string
}

const SimpleDialog = ({ open, onClose, userIds, userMap, selectedValue, title }: SimpleDialogProps) => {
  const handleClose = () => {
    onClose(selectedValue)
  }

  const handleListItemClick = (value: string) => {
    onClose(value)
  }

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>{title}</DialogTitle>
      <List sx={{ pt: 0 }}>
        {userIds.map(id => (
          <ListItem button onClick={() => handleListItemClick(id)} key={id}>
            <ListItemAvatar>
              <Avatar src={userMap[id].picture}></Avatar>
            </ListItemAvatar>
            <ListItemText primary={userMap[id].name} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  )
}
