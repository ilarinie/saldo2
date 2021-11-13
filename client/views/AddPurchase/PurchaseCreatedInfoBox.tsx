import { Box, Container, Typography } from '@mui/material'
import { formatCurrency } from 'client/utils/formatCurrency'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { Bar, BarChart, ResponsiveContainer, YAxis } from 'recharts'

interface SaldoPurchaseCreatedInfoBoxProps {
  previousDiff: number
  newDiff: number
  purchaseDescription: string
  purchaseAmount: number
}

const ticks = (newDiff: number) => {
  const ticks = [0, 0, 50]
  if (newDiff < 50) {
    ticks.push(75)
  } else if (newDiff >= 50 && newDiff < 100) {
    ticks.push(150)
  } else if (newDiff >= 100 && newDiff < 200) {
    ticks.push(250)
  } else if (newDiff >= 200 && newDiff < 300) {
    ticks.push(350)
  } else if (newDiff >= 300 && newDiff < 400) {
    ticks.push(450)
  } else if (newDiff >= 400 && newDiff < 500) {
    ticks.push(550)
  } else if (newDiff >= 500 && newDiff < 600) {
    ticks.push(650)
  }
  return ticks
}

export const SaldoPurchaseCreatedInfoBox = ({
  previousDiff,
  newDiff,
  purchaseDescription,
  purchaseAmount,
}: SaldoPurchaseCreatedInfoBoxProps) => {
  const [showPurchase, setShowPurchase] = useState(true)

  const [data, setData] = useState([
    {
      name: 'Page A',
      uv: previousDiff,
      animationActive: false,
    },
  ])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setData([
        {
          name: 'Page A',
          uv: newDiff,
          animationActive: true,
        },
      ])
    }, 1000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <Container sx={{ padding: '1em', textAlign: 'center' }}>
      <Typography variant='h4'>Saldo updated</Typography>
      <Box>
        <ResponsiveContainer width='100%' height={200}>
          <BarChart width={150} height={200} data={data}>
            <Bar label isAnimationActive={data[0].animationActive} dataKey='uv' fill='#8884d8' animationDuration={3000} />
            <YAxis ticks={ticks(newDiff)} tickFormatter={value => formatCurrency(value)} />
          </BarChart>
        </ResponsiveContainer>
        {purchaseDescription} -
        {showPurchase && (
          <>
            {' '}
            <CountUp start={purchaseAmount} end={0} duration={3} decimals={2} delay={1} onEnd={() => setShowPurchase(false)} /> €{' '}
          </>
        )}
        <Box>
          <Typography variant='h6'>New saldo</Typography>
          <CountUp start={previousDiff} end={newDiff} duration={3} decimals={2} delay={1} /> €
        </Box>
      </Box>
    </Container>
  )
}
