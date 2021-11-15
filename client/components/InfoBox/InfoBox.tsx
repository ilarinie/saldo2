import { Box, styled } from '@mui/system'
import { InfoBoxData } from './InfoBoxData'

interface InfoBoxProps {
  data: InfoBoxData
  fullSize?: boolean
}

export const InfoBox = ({ data: { topText = 'default', value = '43', bottomText = 'default' }, fullSize }: InfoBoxProps) => {
  const style = fullSize ? { width: '100%', height: '100%' } : {}
  return (
    <InfoBoxContainer sx={style}>
      <TextContainer>{topText}</TextContainer>
      <ValueContainer>{value}</ValueContainer>
      <TextContainer>{bottomText}</TextContainer>
    </InfoBoxContainer>
  )
}

const InfoBoxContainer = styled(Box)(
  ({ theme }) => `
  height: 115px;
  width: 115px;
  display: flex;
  flex-direction: column;
  border: 1px solid ${theme.palette.secondary.main};
  align-items: center;
  justify-content: space-around;
  padding: 0.5em;
`
)

const TextContainer = styled(Box)`
  font-variant: small-caps;
  font-weight: 500;
  letter-spacing: 1px;
`

const ValueContainer = styled(Box)`
  font-size: 24px;
  font-weight: 700;
`
