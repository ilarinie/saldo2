import { Container, Typography } from '@mui/material'
import { styled } from '@mui/system'
import { SaldoTotalPanel } from 'client/components'
import { InfoBoxRow } from 'client/components/InfoBox/InfoBoxRow'
import { Timeperiod, useTimeperiodPurchases } from 'client/hooks/useTimeperiodPurchases'
import { formatCurrency } from 'client/utils/formatCurrency'
import currency from 'currency.js'
import { differenceInDays, format } from 'date-fns'
import { endOfMonth, startOfMonth } from 'date-fns/esm'
import { useEffect, useMemo, useState } from 'react'
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Budget, PurchaseUser, UserTotal } from 'types'

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
    const data: {
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

  const projectedPurchases = useMemo(() => {
    const currentDate = new Date()
    const daysFromStartOfTheMonth = differenceInDays(currentDate, startOfMonth(currentDate))
    const daysToEndOfTheMonth = differenceInDays(endOfMonth(currentDate), currentDate)
    const dailyRate = daysFromStartOfTheMonth / monthlyTotal

    return monthlyTotal + dailyRate * daysToEndOfTheMonth
  }, [monthlyTotal])

  return (
    <DetailContainer>
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
              topText: format(new Date(), 'MMMM').toLowerCase(),
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
            <YAxis
              tickCount={3}
              tickLine={false}
              tickFormatter={value => formatCurrency(value)}
              tick={CustomizedYAxisTick}
              domain={['dataMin', projectedPurchases]}
            />
            <Tooltip
              formatter={(value: number, time: number, props: any) => [
                `value: ${value}`,
                // eslint-disable-next-line react/prop-types
                `time: ${new Date(props.payload.time).toLocaleDateString()}`,
              ]}
            />
            <XAxis
              type='number'
              dataKey='time'
              minTickGap={0}
              tickCount={2}
              domain={[startOfMonth(new Date).getTime(), endOfMonth(new Date).getTime()]}
              ticks={generateTicks()}
              tick={CustomizedAxisTick}
              tickFormatter={value => {
                return format(new Date(value), 'd. MMMM')
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </TitlePanel>
    </DetailContainer>
  )
}

const DetailContainer = styled(Container)`
  padding: 0;
`

const TitlePanel = styled(Container)`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const CustomizedYAxisTick = (props: any) => {
  const { x, y, stroke, payload, index } = props

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={16} fill='#666' textAnchor='end' fontSize='11px'>
        {formatCurrency(payload.value)}
      </text>
    </g>
  )
}

const CustomizedAxisTick = (props: any) => {
  const { x, y, stroke, payload, index } = props

  return (
    <g transform={`translate(${x},${y})`}>
      <text x={0} y={0} dy={10} dx={index === 0 ? 0 : 25} textAnchor={index === 0 ? 'start' : 'end'} fill='#666' fontSize='11px'>
        {format(new Date(payload.value), 'd. MMMM')}
      </text>
    </g>
  )
}
