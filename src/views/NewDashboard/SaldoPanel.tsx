import { InfoIcon, RepeatIcon } from '@chakra-ui/icons';
import { Center, Flex, IconButton, Text } from '@chakra-ui/react';
import { addZeroes } from '../../addZeroes';

export const SaldoPanel = ({
  total,
  changeToday,
  openSaldoHistory,
  refreshPurchases,
}: {
  total: number;
  changeToday: number;
  openSaldoHistory: () => void;
  refreshPurchases: () => void;
}) => {
  return (
    <Center>
      <IconButton
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
        }}
        variant='outlined'
        icon={<InfoIcon />}
        aria-label='info'
        onClick={openSaldoHistory}
      />
      <IconButton
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
        }}
        variant='outlined'
        icon={<RepeatIcon />}
        aria-label='refresh'
        onClick={refreshPurchases}
      />
      <Flex alignItems='flex-end'>
        <Text
          lineHeight='20px'
          fontWeight={600}
          fontSize={32}
          color={total > 0 ? 'negativeColor' : 'positiveColor'}
        >
          {total > 0 && '+ '}
          {addZeroes(total.toString())} €
        </Text>
        <Text lineHeight='20px' marginLeft={4}>
          ({changeToday >= 0 && '+ '}
          {changeToday.toFixed(2)})
        </Text>
      </Flex>
    </Center>
  );
};
