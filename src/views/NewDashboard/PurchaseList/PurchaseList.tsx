import { Box, Container, Text } from '@chakra-ui/react';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { PurchaseWithCumTotal } from '../../../models/Purchase';
import { DateToPurchaseMap } from '../../../state/RootState';
import { PurchaseDetailsDialog } from './PurchaseDetailsDialog';
import { PurchaseItem } from './PurchaseItem';

export interface PurchaseListProps {
  purchasesWithCumTotal: PurchaseWithCumTotal[];
  dateToPurchaseMap: DateToPurchaseMap;
  deletePurchase: (purchaseId: string) => void;
  deleteMode: boolean;
  requestConfirmPurchase: (amount: number | null, description: string) => void;
  filterText?: string;
}

export const PurchaseList: React.FC<PurchaseListProps> = observer(
  ({
    dateToPurchaseMap,
    deletePurchase,
    requestConfirmPurchase,
    purchasesWithCumTotal,
    filterText,
  }) => {
    const [selectedPurchase, setSelectedPurchase] = useState(
      null as PurchaseWithCumTotal | null
    );
    const [filteredList, setFilteredList] = useState(
      [] as PurchaseWithCumTotal[]
    );

    useEffect(() => {
      if (filterText) {
        setFilteredList(
          [...purchasesWithCumTotal].filter((a) =>
            a.description.toLowerCase().includes(filterText.toLowerCase())
          )
        );
      }
    }, [filterText, purchasesWithCumTotal]);

    return (
      <Container height='100%'>
        <Box
          hidden={!(!filterText || filterText === '')}
          overflow='scroll'
          height='100%'
          paddingBottom='100%'
        >
          {Object.keys(dateToPurchaseMap).map((d) => (
            <Box key={d}>
              <Text
                className='dateSpan'
                as='span'
                fontSize='small'
                backgroundColor='red'
              >
                {d}
              </Text>
              <hr className='dateHorizontalLine' />
              {dateToPurchaseMap[d].map((p) => (
                <PurchaseItem
                  onLongPress={() => setSelectedPurchase(p)}
                  requestConfirmPurchase={requestConfirmPurchase}
                  key={p._id}
                  purchase={p}
                  deletePurchase={deletePurchase}
                />
              ))}
            </Box>
          ))}
        </Box>
        {filterText && (
          <Box overflow='scroll' height='100%' paddingBottom='100%'>
            {filteredList.map((p) => {
              return (
                <PurchaseItem
                  onLongPress={() => setSelectedPurchase(p)}
                  requestConfirmPurchase={requestConfirmPurchase}
                  key={p._id}
                  purchase={p}
                  deletePurchase={deletePurchase}
                />
              );
            })}
            {filteredList.length === 0 && (
              <Box>Ei tuloksia haulle "{filterText}"</Box>
            )}
          </Box>
        )}
        <PurchaseDetailsDialog
          onClose={() => setSelectedPurchase(null)}
          purchase={selectedPurchase}
          deletePurchase={deletePurchase}
          requestConfirmPurchase={requestConfirmPurchase}
        />
      </Container>
    );
  }
);
