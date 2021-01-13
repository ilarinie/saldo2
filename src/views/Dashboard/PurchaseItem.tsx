import { DeleteIcon } from '@chakra-ui/icons';
import { Box, Flex, IconButton, Text, useTheme } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import ArrowIcon from '../../components/ArrowIcon';
import { PurchaseWithCumTotal } from '../../models/Purchase';

interface PurchaseItemProps {
    purchase: PurchaseWithCumTotal;
    deletePurchase: (purchaseId: string) => void;
    deleteMode: boolean;
}

export const PurchaseItem: React.FC<PurchaseItemProps> = observer(({ purchase, deletePurchase, deleteMode }) => {

    const theme = useTheme();

    return (
        <Box className='purchaseItemContainer'>
            {deleteMode &&
                <IconButton onClick={() => deletePurchase(purchase._id)} variant='outlined' aria-label='delete' icon={<DeleteIcon />} className='deleteButton' />
            }
            <Box marginRight='1em'>
                <ArrowIcon radius='36px' up={purchase.amount > 0} color={purchase.amount > 0 ? theme.colors.negativeColor : theme.colors.positiveColor} />
            </Box>
            <Flex justifyContent='space-between' flexGrow={1}>
                <Box>
                    <Text>{purchase.description}</Text>
                    <Text className='purchaseDate'>{new Date(purchase.createdAt || '').toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</Text>
                </Box>
                <Box>
                    <Text color={purchase.amount > 0 ? 'negativeColor' : 'positiveColor'} textAlign='right'>{purchase.amount > 0 && '+'}{purchase.amount} €</Text>
                    <Text textAlign='right' className='purchaseDate'>{purchase.cumTotal.toFixed(2)} €</Text>
                </Box>
            </Flex>
        </Box>
    );
});
