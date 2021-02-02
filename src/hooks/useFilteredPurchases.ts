import { useEffect, useState } from 'react';
import { Purchase } from '../models/Purchase';

export const useFilteredPurchases = (purchases: Purchase[]) => {
  const [filteredPurchases, setFilteredPurchases] = useState([] as Purchase[]);

  useEffect(() => {
    const sortedPurchases = purchases.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    const uniquePurchaseList = [] as Purchase[];
    uniquePurchaseList.length = 0;
    let i = 0;
    console.log(uniquePurchaseList.length);

    while (
      uniquePurchaseList.length < Math.min(5, sortedPurchases.length) &&
      i < sortedPurchases.length
    ) {
      const j = i;
      if (
        !uniquePurchaseList.find((p) => {
          console.log(p);
          return (
            p.amount === sortedPurchases[j].amount &&
            p.description === sortedPurchases[j].description
          );
        })
      ) {
        uniquePurchaseList.push(sortedPurchases[i]);
      }
      i++;
    }
    setFilteredPurchases(uniquePurchaseList);
  }, [purchases]);

  return filteredPurchases;
};
