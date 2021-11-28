import { Container } from '@mui/material'
import { styled } from '@mui/system'
import { LoadingBox } from 'client/components'
import { useBudgetViewData } from 'client/hooks/useBudgetViewData'
import { BudgetDetailsView } from './BudgetDetailsView'

export const BudgetDetailsContainer = () => {
  const { budget, currentUser } = useBudgetViewData()
  return (
    <DetailsContainer>
      {budget ? <BudgetDetailsView budget={budget} currentUser={currentUser} /> : <LoadingBox isLoading={!budget} error='' />}
    </DetailsContainer>
  )
}

const DetailsContainer = styled(Container)(
  ({ theme }) => `
  background: ${theme.palette.grey['900']};
  min-height: calc(100vh - 65px);
`
)
