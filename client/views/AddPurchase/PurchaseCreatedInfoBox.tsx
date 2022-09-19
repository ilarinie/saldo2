import { Box, Container, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { useHistory } from 'react-router-dom'
import audio from '../../assets/cash.mp3'
import DoubleArrowIcon from '@mui/icons-material/DoubleArrow';
import { formatCurrency } from 'client/utils/formatCurrency'

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
    <Container sx={{ padding: '1em', textAlign: 'center', height: '90%'}}>
      <Typography variant='h4'>Saldo updated</Typography>
      <Typography marginTop={8} variant='h6'>Added</Typography>
      <Typography variant='h5' sx={{ textTransform: 'uppercase', fontVariant: 'small-caps'}}>{purchaseDescription} {formatCurrency(purchaseAmount)}</Typography>
      <Typography marginTop={2} variant='h6'>New saldo</Typography>
      <Typography variant='h5'>{formatCurrency(newDiff)}</Typography>
    </Container>
  )
}
