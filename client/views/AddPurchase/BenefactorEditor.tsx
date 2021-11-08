import { Avatar, Slider } from '@mui/material'
import { Box, styled } from '@mui/system'
import { formatCurrency } from 'client/utils/formatCurrency'
import currency from 'currency.js'
import { Benefactor } from 'types'

interface BenefactorEditorProps {
  benefactors: Benefactor[]
  defaultMode?: 'even-split' | 'saldo'
  total: number
  onBenefactorsChanged: (benefactors: Benefactor[]) => void
}

export const BenefactorEditor = ({ benefactors, onBenefactorsChanged, total }: BenefactorEditorProps) => {
  const onAmountChanged = (event: any) => {
    const name = event.target.name
    const value = event.target.value
    const currentValue = benefactors.find(e => e.user._id === name)?.amountBenefitted as number
    const diff = value - currentValue
    const totalNumberMembers = benefactors.length - 1
    const divided = currency(diff).distribute(totalNumberMembers)
    let i = -1

    onBenefactorsChanged(
      benefactors.map(b => {
        if (b.user._id === name) {
          return {
            ...b,
            amountBenefitted: value,
          }
        } else {
          i++
          return {
            ...b,
            amountBenefitted: currency(b.amountBenefitted - divided[i].value).value,
          }
        }
      })
    )
  }

  return (
    <Box sx={{ position: 'relative' }}>
      {total === 0 && <DisabledOverlay />}
      {benefactors.map(b => (
        <StyledSliderContainer key={b.user._id}>
          <Box
            sx={{
              width: '30px',
              marginRight: '15px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ width: '30px', height: '30px' }} src={b.user.picture} />
            <small style={{ fontSize: '0.7rem' }}>{b.user.name.split(' ')[0]}</small>
          </Box>
          <ActualSliderContainer>
            <Slider
              disabled={total === 0}
              name={b.user._id}
              value={b.amountBenefitted}
              min={0}
              step={0.1}
              max={total}
              onChange={onAmountChanged}
              color='secondary'
            />
          </ActualSliderContainer>
          <Box
            sx={{
              width: '50px',
              marginLeft: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div>{formatCurrency(b.amountBenefitted)}</div>
          </Box>
        </StyledSliderContainer>
      ))}
    </Box>
  )
}

const DisabledOverlay = styled(Box)`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
  backdrop-filter: grayscale(1);
`

const StyledSliderContainer = styled(Box)`
  display: flex;
  width: 100%;
  margin-bottom: 8px;
  justify-content: space-between;
  align-content: center;
`

const ActualSliderContainer = styled(Box)`
  flex-grow: 1;
  margin-left: 1em;
  display: flex;
`
