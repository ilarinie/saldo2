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
import { useCreatePurchaseMutation } from 'client/store/purchaseApi'
import { Purchase } from 'types'
import { v4 } from 'uuid'

export const FaceliftBudgetView = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const match = useRouteMatch<{ budgetId: string }>('/budgets/:budgetId')
  const { currentData: budget } = useGetBudgetQuery(match?.params.budgetId || '')
  const [createPurchase] = useCreatePurchaseMutation()

  const currentUser = useSelector(selectCurrentUser)

  const onCloseCreateModal = (purchase?: Partial<Purchase>) => {
    const purchaseId = v4()
    console.log('foppa', purchaseId)
    if (purchase) {
      createPurchase({ ...purchase, purchaseId })
    }
    setModalOpen(false)
  }

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

  const { update: updateDailyTotal } = useCountUp({
    ref: 'faa',
    start: 0,
    end: 0,
    startOnMount: true,
    decimal: ',',
    decimals: 2,
    decimalPlaces: 2,
    useEasing: true,
  })

  const { update: updateMonthlyTotal } = useCountUp({
    ref: 'fii',
    start: 0,
    end: 0,
    startOnMount: true,
    decimal: ',',
    decimals: 2,
    decimalPlaces: 2,
    useEasing: true,
  })

  const { counts: dailyCounts } = useTimeperiodPurchases(budget?.purchases ?? [], Timeperiod.TODAY, (userDiffs: any) => {
    updateDailyTotal(userDiffs[currentUser._id] ?? 0)
  })
  const { counts: monthlyCounts } = useTimeperiodPurchases(budget?.purchases ?? [], Timeperiod.THIS_MONTH, (userDiffs: any) => {
    updateMonthlyTotal(userDiffs[currentUser._id] ?? 0)
  })

  useEffect(() => {
    update(budget?.totals.find(t => t.user._id === currentUser._id)?.diff || 0)
  }, [budget?.total])

  return (
    <BudgetContainer>
      <>
        <Cont sx={{ marginTop: '10px' }} onClick={() => setModalOpen(true)}>
          +
        </Cont>
        <Cont2 onClick={() => scroll.scrollToTop({ duration: 500 })}>
          <KeyboardArrowUpIcon sx={{ marginTop: '10px' }} />
        </Cont2>
        <SumContainer>
          <SumContents isontop='true'>
            <div id='foo' />€
          </SumContents>
        </SumContainer>
        <RestContainer>
          <ValuesContainer>
            <TitleValue second='today' first={dailyCounts[currentUser._id] < 0 ? 'down' : 'up'}>
              <div id='faa' />
            </TitleValue>
            <TitleValue second='last 30d' first={monthlyCounts[currentUser._id] < 0 ? 'down' : 'up'}>
              <div id='fii' />
            </TitleValue>
          </ValuesContainer>

          {budget ? (
            <>
              <ListContainer>
                <PurchaseList currentUser={currentUser} budget={budget} limit={20} />
              </ListContainer>
              <CreateModal
                modalOpen={modalOpen}
                onClose={purchase => onCloseCreateModal(purchase)}
                budget={budget}
                currentUser={currentUser}
              />
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

const LoadingOverlay = styled(Box)`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(5px);
  flex-direction: column;
  font-size: 0.5rem;
  z-index: 10;
`

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
const SumContents = styled(Box)<{ isontop: string }>(
  ({ theme, isontop }) => `
  z-index: 1;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 90px;
  ${isontop !== 'true' && 'font-size: 1rem; height: 75px; translate: scale(0.33);'}
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
  font-size: 3.5rem;
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
