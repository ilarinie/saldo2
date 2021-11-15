import { Box, styled } from '@mui/system'
import { InfoBox } from '..'
import { InfoBoxData } from './InfoBoxData'

interface InfoBoxRowProps {
  data: InfoBoxData[]
}

export const InfoBoxRow = ({ data }: InfoBoxRowProps) => {
  return (
    <InfoBoxRowContainer>
      {data.slice(0, 2).map((d, index) => (
        <InfoBoxContainer key={index}>
          <InfoBox data={d} fullSize />
        </InfoBoxContainer>
      ))}
    </InfoBoxRowContainer>
  )
}

const InfoBoxRowContainer = styled(Box)`
  display: flex;
  height: 132px;
  padding: 16px 0;
  justify-content: space-around;
`

const InfoBoxContainer = styled(Box)`
  height: 115px;
  width: 115px;
`
