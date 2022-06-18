import { Avatar, Typography } from '@mui/material'
import { Box, styled } from '@mui/system'
import { PurchaseUser } from 'types'

interface AppBarProps {
  currentUser: PurchaseUser
  setDrawerOpen: (open: boolean) => void
  isDrawerOpen: boolean
}

export const AppBar = ({ currentUser, setDrawerOpen, isDrawerOpen }: AppBarProps) => {
  return (
    <AppBarContainer position='static'>
      <AppTitle variant='h4' gutterBottom>
        - SALDO -
      </AppTitle>
      <AppAvatar src={currentUser.picture} onClick={() => setDrawerOpen(!isDrawerOpen)} />
    </AppBarContainer>
  )
}

const AppAvatar = styled(Avatar)`
  margin-bottom: 17px;
  width: 30px;
  height: 30px;
`

const AppTitle = styled(Typography)`
  font-family: 'LogoFont';
  text-align: center;
`

const AppBarContainer = styled(Box)`
  padding-top: 5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* background: #000;
  width: 100vw;
  top: 0;
  left: 0; */
`
