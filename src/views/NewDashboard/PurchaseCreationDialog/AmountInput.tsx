import { Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import React from 'react';

interface AmountInputProps {
  amount: number | undefined;
  onAmountChange: (amount: number) => void;
}

export const AmountInput = ({ amount, onAmountChange }: AmountInputProps) => {
  return (
    <InputGroup size='md' marginY='0.5em'>
      <Input
        value={amount || ''}
        type='number'
        step='0.01'
        onChange={(event) => {
          onAmountChange(event.target.value as any);
        }}
        placeholder='Aseta summa'
      />
      <InputRightAddon color='black' children='€' />
    </InputGroup>
  );
};
