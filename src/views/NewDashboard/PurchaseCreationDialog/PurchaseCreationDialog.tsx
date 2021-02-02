import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import { useState } from 'react';
import Swipezor from 'react-swipezor';
import ilariNaama from '../../../assets/ilarinaama.jpeg';
import olliNaama from '../../../assets/ollinaama.jpeg';
import { AmountInput } from './AmountInput';

export interface PurchaseCreationDialogProps {
  description: string;
  amount: number | null;
  confirmPurchase: (amount: number, description: string) => void;
  onClose: () => void;
}

export const PurchaseCreationDialog: React.FC<PurchaseCreationDialogProps> = ({
  description,
  amount,
  confirmPurchase,
  onClose,
}) => {
  const delayPurchaseConfirmation = () => {
    setTimeout(() => {
      confirmPurchase(actualAmount, description);
    }, 300);
  };

  const onPayerSelect = (payer: 'olli' | 'ilari') => {
    if (payer === 'ilari') {
      if (actualAmount < 0) {
        setActualAmount(actualAmount * -1);
      }
    } else {
      if (actualAmount > 0) {
        setActualAmount(actualAmount * -1);
      }
    }
  };

  const [actualAmount, setActualAmount] = useState(amount || 0);

  return (
    <Box className='confirm-dialog-container'>
      <Text className='header'>Vahvista luonti</Text>
      <Box className='value-container'>
        <Text className='label'>selite</Text>
        <Text className='value' fontWeight={600}>
          {description}
        </Text>
      </Box>
      <Box className='value-container'>
        <Text className='label'>vaikutus saldoon</Text>
        {amount ? (
          <Text
            className='value'
            color={actualAmount > 0 ? 'negativeColor' : 'positiveColor'}
          >
            {actualAmount > 0 && '+'}
            {actualAmount.toFixed(2)} €
          </Text>
        ) : (
          <AmountInput amount={actualAmount} onAmountChange={setActualAmount} />
        )}
      </Box>
      <Box className='value-container payer-container'>
        <Text className='label'>rahaa käytti</Text>
        <Flex>
          <Image
            src={ilariNaama}
            className={`payer-selector ${actualAmount > 0 && 'selected'}`}
            onClick={() => onPayerSelect('ilari')}
          />
          <Image
            src={olliNaama}
            onClick={() => onPayerSelect('olli')}
            className={`payer-selector ${actualAmount < 0 && 'selected'}`}
          />
        </Flex>
      </Box>
      <Box zIndex={actualAmount ? 1 : -2} className='swipe-container'>
        <Swipezor
          mainText='Vahvista'
          onSwipeDone={delayPurchaseConfirmation}
          overlayText='OK'
          overlayClassList='swipe-overlay'
          caretClassList='swipe-caret'
        />
      </Box>
      <Box className='buttonContainer'>
        <Button colorScheme='darkgray' variant='outline' onClick={onClose}>
          Peruuta
        </Button>
      </Box>
    </Box>
  );
};
