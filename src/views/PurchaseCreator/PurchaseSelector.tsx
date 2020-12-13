import { Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useFilteredPurchases } from '../../hooks/useFilteredPurchases';
import { Purchase } from '../../models/Purchase';
import { PurchaseButton } from './PurchaseButton';


//@ts-ignore
export const PurchaseSelector = ({requestConfirmPurchase, purchases}) => {

    const filteredPurchases = useFilteredPurchases(purchases);

return (
    <Box>
        <Box variant="h5">Valitse</Box>
            <Box 
              style={{
                marginBottom: "10px",
                width: "98%",
                display: "flex",
                flexDirection: "column",
                padding: "0.5em",
                height: "calc(100vh - 385px)",
                overflow: "auto",
              }}
            >
            {filteredPurchases.map((p: Purchase) => (
                <PurchaseButton
                  key={p.description + p.amount}
                  preset={p}
                  onClick={() => requestConfirmPurchase(p.amount, p.description)}
                />
            ))}
            </Box>
        </Box>

)
}