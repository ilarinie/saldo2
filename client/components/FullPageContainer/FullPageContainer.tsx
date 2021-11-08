import { CircularProgress, Container } from '@mui/material'
import { styled } from '@mui/system'
import { ReactNode } from 'react'

interface FullPageContainerProps {
  loading: boolean
  children: ReactNode
}

const StyledContainer = styled(Container)(
  ({ theme }) => `
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  height: 100%;
  width: 100vw;
  z-index: 2;
  background: ${theme.palette.background.default};
`
)

export const FullPageContainer = ({ loading, children }: FullPageContainerProps) => {
  return <StyledContainer>{loading ? <CircularProgress color='inherit' /> : children}</StyledContainer>
}
