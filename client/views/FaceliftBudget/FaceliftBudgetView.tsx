import { Box, CircularProgress, styled } from '@mui/material'
import { PurchaseList } from 'client/components'
import { TitleValue } from 'client/components/TitleValue/TitleValue'
import { Timeperiod, useTimeperiodPurchases } from 'client/hooks/useTimeperiodPurchases'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import { animateScroll as scroll } from 'react-scroll'
import { CreateModal } from './CreateModal'
import { useEffect, useState } from 'react'
import { useCountUp } from 'react-countup'
import { useGetBudgetQuery } from 'client/store/budgetApi'
import { useSelector } from 'react-redux'
import { useRouteMatch } from 'react-router'
import { selectCurrentUser } from 'client/store/authSlice'
import { formatCurrency } from 'client/utils/formatCurrency'
import { useScrollPosition } from './useScrollPosition'

export const FaceliftBudgetView = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const match = useRouteMatch<{ budgetId: string }>('/budgets/:budgetId')
  const { data: budget } = useGetBudgetQuery(match?.params.budgetId || '')
  const currentUser = useSelector(selectCurrentUser)

  const { update } = useCountUp({
    ref: 'foo',
    start: 0,
    end: 0,
    startOnMount: true,
    decimal: ',',
    decimals: 2,
    decimalPlaces: 2,
    useEasing: true,
  })

  const { counts: dailyCounts } = useTimeperiodPurchases(budget?.purchases ?? [], Timeperiod.TODAY)
  const { total: monthlyTotal, counts: monthlyCounts } = useTimeperiodPurchases(budget?.purchases ?? [], Timeperiod.THIS_MONTH)

  useEffect(() => {
    update(budget?.totals.find(t => t.user._id === currentUser._id)?.diff || 0)
  }, [budget?.total])

  const scrollPosition = useScrollPosition()

  return (
    <BudgetContainer onScroll={event => console.log(event)}>
      <>
        <Cont sx={{ marginTop: '10px' }} onClick={() => setModalOpen(true)}>
          +
        </Cont>
        <Cont2 onClick={() => scroll.scrollToTop()}>{scrollPosition > 75 && <KeyboardArrowUpIcon sx={{ marginTop: '10px' }} />}</Cont2>
        <SumContainer>
          <SumContents isOnTop={scrollPosition < 75}>
            <div id='foo' />€
          </SumContents>
        </SumContainer>
        <RestContainer>
          {budget ? (
            <>
              <ValuesContainer>
                <TitleValue
                  second='today'
                  first={dailyCounts[currentUser._id] < 0 ? 'down' : 'up'}
                  value={formatCurrency(dailyCounts[currentUser._id])}
                />
                <TitleValue
                  second='this month'
                  first={monthlyCounts[currentUser._id] < 0 ? 'down' : 'up'}
                  value={formatCurrency(monthlyCounts[currentUser._id])}
                />
              </ValuesContainer>
              <ListContainer>
                <PurchaseList currentUser={currentUser} budget={budget} />
              </ListContainer>
              <CreateModal modalOpen={modalOpen} onClose={() => setModalOpen(false)} budget={budget} currentUser={currentUser} />
            </>
          ) : (
            <div style={{ height: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress color='inherit' size={65} />
            </div>
          )}
        </RestContainer>
      </>
    </BudgetContainer>
  )
}

const Cont = styled(Box)`
  position: fixed;
  top: 1em;
  right: 2em;
  z-index: 3;
`

const Cont2 = styled(Box)`
  position: fixed;
  top: 1em;
  left: 2em;
  z-index: 2;
`

const BudgetContainer = styled(Box)`
  display: flex;
  flex-direction: column;
`
const SumContents = styled(Box)<{ isOnTop: boolean }>(
  ({ theme, isOnTop }) => `
  z-index: 1;
  transition: 0.1s linear;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${!isOnTop && 'font-size: 1rem; height: 75px; translate: scale(0.33);'}
`
)

const SumContainer = styled(Box)(
  ({ theme }) => `
  position: sticky;
  top: 0px;
  margin-top: 100px;
  padding-bottom: 0em;
  left: 0;
  right: 0;
  width: 100vw;
  z-index: 1;
  background: ${theme.palette.background.default};
  font-size: 3rem;
  font-weight: 300;
`
)

const RestContainer = styled(Box)`
  margin-top: 4em;
`

const ValuesContainer = styled(Box)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding-bottom: 2em;
`

const ListContainer = styled(Box)`
  padding: 0 1em;
  overflow-y: scroll;
  height: 100%;
`
