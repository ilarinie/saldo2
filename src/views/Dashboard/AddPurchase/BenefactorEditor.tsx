import { Avatar, Button, ButtonGroup, Slider } from '@mui/material';
import { Box, styled } from '@mui/system';
import currency from 'currency.js';
import { Benefactor } from 'src/models/Budget';
import { CurrencyFormatOptions } from '../BudgetList/BudgetItem/BudgetItem';

interface BenefactorEditorProps {
  benefactors: Benefactor[];
  defaultMode?: 'even-split' | 'saldo';
  total: number;
  onBenefactorsChanged: (benefactors: Benefactor[]) => void;
  onDefaultModeChanged: (mode: 'saldo' | 'even-split') => void;
}

export const BenefactorEditor = ({
  benefactors,
  onBenefactorsChanged,
  total,
  onDefaultModeChanged,
}: BenefactorEditorProps) => {
  const onAmountChanged = (event: any) => {
    const name = event.target.name;
    const value = event.target.value;
    const currentValue = benefactors.find((e) => e.user._id === name)
      ?.amountBenefitted as number;
    let diff = value - currentValue;
    const totalNumberMembers = benefactors.length - 1;
    const divided = currency(diff).distribute(totalNumberMembers);
    let i = -1;

    onBenefactorsChanged(
      benefactors.map((b) => {
        if (b.user._id === name) {
          return {
            ...b,
            amountBenefitted: value,
          };
        } else {
          i++;
          return {
            ...b,
            amountBenefitted: currency(b.amountBenefitted - divided[i].value)
              .value,
          };
        }
      })
    );
  };

  return (
    <Box>
      <ButtonGroup>
        <Button onClick={() => onDefaultModeChanged('even-split')}>
          Even split
        </Button>
      </ButtonGroup>
      <Button onClick={() => onDefaultModeChanged('saldo')}>Saldo</Button>
      {benefactors.map((b) => (
        <StyledSliderContainer key={b.user._id}>
          <Box
            sx={{
              width: '50px',
              marginRight: '24px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar src={b.user.picture} />
            {b.user.name.split(' ')[0]}
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
              valueLabelDisplay='on'
              color='secondary'
              valueLabelFormat={(value) =>
                currency(value).format(CurrencyFormatOptions)
              }
            />
          </ActualSliderContainer>
        </StyledSliderContainer>
      ))}
    </Box>
  );
};

const StyledSliderContainer = styled(Box)`
  display: flex;
  width: 100%;
  margin-top: 40px;
  justify-content: space-between;
`;

const ActualSliderContainer = styled(Box)`
  flex-grow: 1;
`;
