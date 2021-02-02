import { Input, InputGroup, InputRightAddon } from '@chakra-ui/react';
import React from 'react';

interface AmountInputProps {
  amount: number;
  onAmountChange: (amount: number) => void;
}

export const AmountInput = ({ amount, onAmountChange }: AmountInputProps) => {
  return (
    <InputGroup size='md' marginY='0.5em'>
      <Input
        marginLeft='20%'
        background='#eee'
        color='black'
        width='50%'
        value={amount}
        type='number'
        onChange={(event) => {
          const num = parseFloat(event.target.value);
          if (isNaN(num)) {
            onAmountChange(0);
          }
          onAmountChange(num);
        }}
        placeholder='Aseta summa'
      />
      <InputRightAddon color='black' children='€' />
    </InputGroup>
  );
};
