import { Box, Flex, Image, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { useLongPress } from 'use-long-press';
import { addZeroes } from '../../../addZeroes';
import ilariNaama from '../../../assets/ilarinaama.jpeg';
import olliNaama from '../../../assets/ollinaama.jpeg';
import { PurchaseWithCumTotal } from '../../../models/Purchase';

interface PurchaseItemProps {
  purchase: PurchaseWithCumTotal;
  deletePurchase: (purchaseId: string) => void;
  requestConfirmPurchase: (amount: number, description: string) => void;
  showDate?: boolean;
  showTotal?: boolean;
  onLongPress: () => void;
}

export const PurchaseItem: React.FC<PurchaseItemProps> = observer(
  ({ purchase, showDate = false, onLongPress, showTotal = true }) => {
    const bind = useLongPress(
      () => {
        onLongPress();
      },
      {
        onStart: () => {
          document.body.style.userSelect = 'none';
        },
        onFinish: () => {
          document.body.style.userSelect = 'initial';
        },
        threshold: 400,
      }
    );

    return (
      <Box {...bind} className='purchaseItemContainer'>
        <Box marginRight='1em'>
          <Image
            src={purchase.amount > 0 ? ilariNaama : olliNaama}
            minWidth='35px'
            minHeight='35px'
            maxWidth='35px'
            maxHeight='35px'
            alt=''
          />
        </Box>
        <Flex justifyContent='space-between' flexGrow={1}>
          <Box>
            <Text fontWeight={600}>{purchase.description}</Text>
            <Text className='purchaseDate'>
              {showDate &&
                new Date(purchase.createdAt || '').toLocaleDateString('fi-FI') +
                  ' '}
              {new Date(purchase.createdAt || '').toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
              })}
              {` `}
            </Text>
          </Box>
          <Box>
            <Text
              fontSize={showTotal ? 'small' : 30}
              color={purchase.amount > 0 ? 'negativeColor' : 'positiveColor'}
              textAlign='right'
            >
              {purchase.amount > 0 && '+'}
              {addZeroes(purchase.amount.toFixed(2))} €
            </Text>
            {showTotal && (
              <Text textAlign='right' className='total'>
                = {addZeroes(purchase.cumTotal.toFixed(2))} €
              </Text>
            )}
          </Box>
        </Flex>
      </Box>
    );
  }
);
