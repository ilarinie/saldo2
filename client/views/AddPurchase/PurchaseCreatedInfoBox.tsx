import { Box, Container, Typography } from '@mui/material'
import { useState } from 'react'
import CountUp from 'react-countup'

interface SaldoPurchaseCreatedInfoBoxProps {
  previousDiff: number
  newDiff: number
  purchaseDescription: string
  purchaseAmount: number
}

export const SaldoPurchaseCreatedInfoBox = ({
  previousDiff,
  newDiff,
  purchaseDescription,
  purchaseAmount,
}: SaldoPurchaseCreatedInfoBoxProps) => {
  const [showPurchase, setShowPurchase] = useState(true)

  return (
    <Container>
      <Typography variant='h5'>Saldo updated</Typography>
      <Typography variant='h6'>New saldo</Typography>
      <Box>
        {purchaseDescription} -
        {showPurchase && (
          <>
            {' '}
            <CountUp start={purchaseAmount} end={0} duration={3} decimals={2} delay={1} onEnd={() => setShowPurchase(false)} /> €{' '}
          </>
        )}
        <Box>
          <CountUp start={previousDiff} end={newDiff} duration={3} decimals={2} delay={1} /> €
        </Box>
      </Box>
    </Container>
  )
}
