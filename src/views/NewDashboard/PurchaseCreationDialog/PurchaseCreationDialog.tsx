import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { User } from 'src/models/Budget';
import { AmountInput } from './AmountInput';

export interface PurchaseCreationDialogProps {
  description?: string;
  amount?: number;
  budgetId: string;
  members: User[];
  confirmPurchase: (
    amount: number | undefined,
    description: string,
    budgetId: string,
    payerId: string
  ) => void;
  onClose: () => void;
}

export const PurchaseCreationDialog: React.FC<PurchaseCreationDialogProps> = ({
  description,
  amount,
  confirmPurchase,
  onClose,
  budgetId,
  members,
}) => {
  const [actualAmount, setActualAmount] = useState(amount);
  const [actualDescription, setActualDescription] = useState(description || '');
  const [selectedUserId, setSelectedUserId] = useState(
    undefined as undefined | string
  );

  const delayPurchaseConfirmation = () => {
    if (selectedUserId) {
      setTimeout(() => {
        confirmPurchase(
          actualAmount,
          actualDescription,
          budgetId,
          selectedUserId
        );
      }, 300);
    }
  };

  const onPayerSelect = (payer: 'olli' | 'ilari') => {
    if (actualAmount) {
      if (payer === 'ilari') {
        if (actualAmount < 0) {
          setActualAmount(actualAmount * -1);
        }
      } else {
        if (actualAmount > 0) {
          setActualAmount(actualAmount * -1);
        }
      }
    }
  };

  return (
    <Box className='confirm-dialog-container'>
      <Text className='header'>Vahvista luonti</Text>
      <Box className='value-container'>
        <Text className='label'>selite</Text>
        <Input
          className='value'
          fontWeight={600}
          value={actualDescription}
          onChange={(e) => setActualDescription(e.target.value)}
        />
      </Box>
      <Box className='value-container'>
        <Text className='label'>vaikutus saldoon</Text>
        {amount && actualAmount ? (
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
        <Flex className='user-selector-container'>
          {members.map((m) => (
            <Flex
              onClick={() => setSelectedUserId(m._id)}
              key={m._id}
              className={`user-selector${
                selectedUserId === m._id ? ' selected-user' : ''
              }`}
            >
              <img src={m.picture} alt='' />
              <Box>{m.name}</Box>
            </Flex>
          ))}
        </Flex>
      </Box>
      <Box className='buttonContainer'>
        <Button colorScheme='green' onClick={delayPurchaseConfirmation}>
          Vahvista
        </Button>
      </Box>
      <Box className='buttonContainer'>
        <Button colorScheme='darkgray' variant='outline' onClick={onClose}>
          Peruuta
        </Button>
      </Box>
    </Box>
  );
};
