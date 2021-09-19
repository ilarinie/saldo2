import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { Benefactor, User } from 'src/models/Budget';
import { AmountInput } from './AmountInput';
import { Dialogue, initBenefactors } from './NewDialogue';

export interface PurchaseCreationDialogProps {
  description?: string;
  amount?: number;
  budgetId: string;
  members: User[];
  confirmPurchase: (
    amount: number | undefined,
    description: string,
    budgetId: string,
    payerId: string,
    benefactors: Benefactor[]
  ) => void;
  onClose: () => void;
  currentUser: User;
}

export const PurchaseCreationDialog: React.FC<PurchaseCreationDialogProps> = ({
  description,
  amount,
  confirmPurchase,
  onClose,
  budgetId,
  members,
  currentUser,
}) => {
  const [actualAmount, setActualAmount] = useState(amount);
  const [actualDescription, setActualDescription] = useState(description || '');
  const [selectedUserId, setSelectedUserId] = useState(currentUser._id);
  const [benefactors, setBenefactors] = useState(
    initBenefactors(members, actualAmount || 0, 'saldo', selectedUserId || '')
  );

  const onAmountChange = (amount: number) => {
    setActualAmount(amount);
    setBenefactors(
      initBenefactors(members, amount || 0, 'saldo', selectedUserId || '')
    );
  };

  const onSelectUserId = (userId: string) => {
    setSelectedUserId(userId);
    setBenefactors(
      initBenefactors(members, actualAmount || 0, 'saldo', userId || '')
    );
  };

  const delayPurchaseConfirmation = () => {
    if (selectedUserId) {
      setTimeout(() => {
        confirmPurchase(
          actualAmount,
          actualDescription,
          budgetId,
          selectedUserId,
          benefactors
        );
      }, 300);
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
          <AmountInput amount={actualAmount} onAmountChange={onAmountChange} />
        )}
      </Box>
      <Box className='value-container payer-container'>
        <Text className='label'>rahaa käytti</Text>
        <Flex className='user-selector-container'>
          {members.map((m) => (
            <Flex
              onClick={() => onSelectUserId(m._id)}
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
      <Dialogue
        benefactors={benefactors}
        total={actualAmount || 0}
        onBenefactorsChanged={setBenefactors}
      />
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
