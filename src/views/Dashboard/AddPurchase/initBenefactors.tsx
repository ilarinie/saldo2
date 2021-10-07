import currency from 'currency.js';
import { PurchaseUser } from 'server/types';

export const initBenefactors = (
  amount: number,
  defaultMode: 'even-split' | 'saldo',
  payerId: string,
  userMap: { [key: string]: PurchaseUser },
  memberIds: string[]
): any[] => {
  if (defaultMode === 'saldo') {
    const membersAmount = currency(amount).distribute(memberIds.length - 1);
    return memberIds.map((m, index) => {
      console.log();
      return {
        user: userMap[m],
        amountPaid: payerId === m ? amount : 0,
        amountBenefitted:
          payerId !== m
            ? membersAmount.splice(
                Math.floor(Math.random() * membersAmount.length),
                1
              )[0].value
            : 0,
      };
    });
  } else {
    const evenDivided = currency(amount).distribute(memberIds.length);
    return memberIds.map((m, index) => {
      return {
        user: userMap[m],
        amountPaid: payerId === m ? amount : 0,
        amountBenefitted: evenDivided.splice(
          Math.floor(Math.random() * evenDivided.length),
          1
        )[0].value,
      };
    });
  }
};
