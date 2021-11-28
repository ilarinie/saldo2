import { Container, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { SaldoTotalPanel } from 'client/components'
import { InfoBoxRow } from 'client/components/InfoBox/InfoBoxRow'
import { Timeperiod, useTimeperiodPurchases } from 'client/hooks/useTimeperiodPurchases'
import { formatCurrency } from 'client/utils/formatCurrency'
import currency from 'currency.js'
import { endOfMonth, startOfMonth } from 'date-fns/esm'
import { useEffect, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Budget, PurchaseUser, UserTotal } from 'types'
import { BudgetDetailsBottomBar } from './BudgetDefailsBottomBar'

interface BudgetDetailsViewProps {
  budget: Budget
  currentUser: PurchaseUser
}

const generateTicks = () => {
  return [startOfMonth(new Date()).getTime(), endOfMonth(new Date()).getTime()]
}

export const BudgetDetailsView = ({ budget, currentUser }: BudgetDetailsViewProps) => {
  const currentUserTotal = budget.totals.find(t => t.user._id === currentUser._id) as UserTotal
  const { total } = useTimeperiodPurchases(budget?.purchases, Timeperiod.TODAY)
  const { total: monthlyTotal, timeperiodPurchases } = useTimeperiodPurchases(budget?.purchases, Timeperiod.THIS_MONTH)
  const [monthlyPurchaseData, setMonthlyPurchaseData] = useState(
    [] as {
      time: number
      value: number
    }[]
  )

  useEffect(() => {
    let data: {
      time: number
      value: number
    }[] = []
    let diff = currentUserTotal.diff
    timeperiodPurchases.forEach(p => {
      // @ts-ignore
      diff = diff - p.benefactors.find(b => b.user._id === currentUser._id).amountPaid
      // @ts-ignore
      diff = diff + p.benefactors.find(b => b.user._id === currentUser._id).amountBenefitted
    })
    data.push({
      time: startOfMonth(new Date()).getTime(),
      value: currency(diff).value,
    })

    timeperiodPurchases.forEach((p, index) => {
      // @ts-ignore
      let value = p.benefactors.find(b => b.user._id === currentUser._id).amountPaid
      // @ts-ignore
      value = value - p.benefactors.find(b => b.user._id === currentUser._id).amountBenefitted

      data.push({
        time: new Date(p.createdAt).getTime(),
        value: data[index].value + value,
      })
    })

    setMonthlyPurchaseData(data)
  }, [monthlyTotal])

  return (
    <DetailContainer>
      {console.log(timeperiodPurchases)}
      {console.log(monthlyPurchaseData)}
      <TitlePanel>
        <Typography variant='h1' sx={{ fontFamily: 'LogoFont', fontSize: '32px' }} gutterBottom>
          {budget.name}
        </Typography>
        <SaldoTotalPanel currentUserTotal={currentUserTotal} />
        <InfoBoxRow
          data={[
            {
              topText: 'purchases',
              value: formatCurrency(total),
              bottomText: 'today',
            },
            {
              topText: 'monthly',
              value: formatCurrency(monthlyTotal),
              bottomText: 'total',
            },
          ]}
        />
        <Typography variant='h6' sx={{ marginTop: '1em' }}>
          Monthly change
        </Typography>
        <ResponsiveContainer height={200} width='100%'>
          <LineChart data={monthlyPurchaseData}>
            <Line dataKey='value' dot={false} type='linear' />
            <YAxis axisLine={false} tickLine={false} tickFormatter={value => formatCurrency(value)} domain={['dataMin', 'dataMax']} />
            <Tooltip
              formatter={(value, time, props) => [`value: ${value}`, `time: ${new Date(props.payload.time).toLocaleDateString()}`]}
            />
            <XAxis
              type='number'
              dataKey='time'
              minTickGap={0}
              tickCount={2}
              domain={['dataMin', 'dataMax']}
              ticks={generateTicks()}
              tickFormatter={value => {
                return new Date(value).toLocaleDateString()
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TitlePanel>
      <BudgetDetailsBottomBar budgetId={budget._id} />
    </DetailContainer>
  )
}

const DetailContainer = styled(Container)`
  padding: 2em;
`

const TitlePanel = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`
