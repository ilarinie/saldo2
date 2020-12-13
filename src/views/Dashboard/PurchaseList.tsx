import { Box, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import { PurchaseWithCumTotal } from '../../models/Purchase';
import { DateToPurchaseMap } from '../../state/RootState';
import { PurchaseItem } from './PurchaseItem';

export interface PurchaseListProps {
    purchasesWithCumTotal: PurchaseWithCumTotal[];
    dateToPurchaseMap: DateToPurchaseMap;
    deletePurchase: (purchaseId: string ) => void;
    deleteMode: boolean;
}

export const PurchaseList: React.FC<PurchaseListProps> = observer(({dateToPurchaseMap, deletePurchase, deleteMode}) => {

    return (
        <>  
            <Box>
                {Object.keys(dateToPurchaseMap).map(d => (
                    <Box key={d}>
                        <Text>{d}</Text>
                        {dateToPurchaseMap[d].map(p => (
                                <PurchaseItem key={p._id} purchase={p} deleteMode={deleteMode}  deletePurchase={deletePurchase} />
                        ))}
                        <hr />
                    </Box>
                ))}
                
            </Box>
        </>
    )
});




