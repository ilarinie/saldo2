import { Box, Container, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { useHistory } from 'react-router-dom'
import audio from '../../assets/cash.mp3'

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
  const audioRef = new Audio(audio)
  const history = useHistory()

  useEffect(() => {
    audioRef.play()
    const timeout = setTimeout(() => {
      history.goBack()
    }, 5000)
    return () => clearTimeout(timeout)
  }, [])

  return (
    <Container sx={{ padding: '1em', textAlign: 'center' }}>
      <Typography variant='h4'>Saldo updated</Typography>
      <Box>
        {purchaseDescription}&nbsp;
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
