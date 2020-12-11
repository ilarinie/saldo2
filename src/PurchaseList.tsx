import { Box, Button, Container, Flex, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { ArrowStatusIcon } from './Dashboard/ArrowIcon';
import { PurchaseWithCumTotal } from './models/Purchase';
import { DateToPurchaseMap } from './RootState';

export interface PurchaseListProps {
    purchasesWithCumTotal: PurchaseWithCumTotal[];
    dateToPurchaseMap: DateToPurchaseMap;
    deletePurchase: (purchaseId: string ) => void;
    deleteMode: boolean;
}

export const PurchaseList: React.FC<PurchaseListProps> = observer(({purchasesWithCumTotal, dateToPurchaseMap, deletePurchase, deleteMode}) => {

    return (
        <>  
            <Box>
                {Object.keys(dateToPurchaseMap).map(d => (
                    <Box>
                        <Text>{d}</Text>
                        {dateToPurchaseMap[d].map(p => (
                                <PurchaseItem key={p._id} purchase={p} deleteMode={deleteMode} style={{}} deletePurchase={deletePurchase} />
                        ))}
                        <hr />
                    </Box>
                ))}
                
            </Box>
        </>
    )
});




const PurchaseItem = observer(({purchase, style, deletePurchase, deleteMode}: { purchase: PurchaseWithCumTotal; style: any; deletePurchase: any; deleteMode: boolean }) => {
    return (
        <Box className='purchaseItemContainer'>
            <Box marginRight='1em'>
                <ArrowStatusIcon radius='36px' up={purchase.amount > 0} color={purchase.amount < 0 ? '#90B571' : '#E54131'} />
            </Box>
            <Flex justifyContent='space-between' flexGrow={1}>
                <Box>
                    <Text>{purchase.description}</Text>
                    <Text className='purchaseDate'>{new Date(purchase.createdAt || '').toLocaleTimeString('en-GB', {})}</Text>
                </Box>
                <Box>
                    <Text color={purchase.amount > 0 ? '#E54131' : '#90B571'} textAlign='right'>{purchase.amount > 0 && '+'}{purchase.amount} €</Text>
                    <Text textAlign='right' className='purchaseDate'>{purchase.cumTotal} €</Text>
                </Box>
            </Flex>
        </Box>
    )
});