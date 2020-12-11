import { Box } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Purchase } from '../models/Purchase';
import { PurchaseButton } from './PurchaseButton';


//@ts-ignore
export const PurchaseSelector = ({requestConfirmPurchase, purchases}) => {

    const [filteredRecentPurchases, setFilteredRecentPurchases] = useState([] as Purchase[]);

    useEffect(() => {

      setFilteredRecentPurchases(
        [
          ...new Set(
            purchases.map((item: Purchase) => item.description + ";" + item.amount)
          ) as Set<String>,
        ]
          .slice(0, Math.max(15, purchases.length))
          .map((i) => {
            return {
              amount: parseFloat(i.split(";")[1]),
              description: i.split(";")[0],
            };
          })
      );
    }, [purchases]);

return (
    <Box
          zIndex={2}
        >
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
            {filteredRecentPurchases.map((p: Purchase) => (
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