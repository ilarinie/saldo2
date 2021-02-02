import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
import { Box, Button, Center, CloseButton, Flex } from '@chakra-ui/react';
import { PurchaseWithCumTotal } from '../../../models/Purchase';
import { PurchaseItem } from './PurchaseItem';

interface PurchaseDetailsDialogProps {
  purchase: PurchaseWithCumTotal | null;
  deletePurchase: (purchaseId: string) => void;
  requestConfirmPurchase: (amount: number | null, description: string) => void;
  onClose: () => void;
}

export const PurchaseDetailsDialog = ({
  purchase,
  deletePurchase,
  requestConfirmPurchase,
  onClose,
}: PurchaseDetailsDialogProps) => {
  if (!purchase) {
    return null;
  }

  const confirmDelete = () => {
    const confirmed = window.confirm('Vahvista poisto');
    if (confirmed) {
      deletePurchase(purchase._id);
      onClose();
    }
  };

  const handleAddButton = () => {
    requestConfirmPurchase(purchase.amount, purchase.description);
    onClose();
  };

  return (
    <Center className='purchaseDetailsDialogOverlay'>
      <Box className='purchaseDetailsDialogContents'>
        <CloseButton
          marginLeft='auto'
          justifySelf='flex-end'
          onClick={onClose}
        />
        <PurchaseItem
          purchase={purchase}
          deletePurchase={deletePurchase}
          requestConfirmPurchase={requestConfirmPurchase}
          showDate
          onLongPress={() => {}}
          showTotal={false}
        />
        <Flex className='purchaseDialogButtonGroup'>
          <Button
            leftIcon={<DeleteIcon />}
            background='negativeColor'
            onClick={confirmDelete}
          >
            Poista
          </Button>
          <Button
            leftIcon={<AddIcon />}
            background='positiveColor'
            onClick={handleAddButton}
          >
            Luo uusi
          </Button>
        </Flex>
      </Box>
    </Center>
  );
};
