import currency from 'currency.js';
import { BudgetType } from '../models/Budget';
import {
  BudgetResponse,
  Purchase,
  PurchaseUser,
} from '../types/BudgetResponse';

interface UserTotalMap {
  [userId: string]: { totalPaid: number; totalBenefitted: number };
}

const fromPurchase = (purchase: Purchase, map: UserTotalMap) => {
  purchase.benefactors.forEach((benefactor) => {
    if (!map[benefactor.user._id]) {
      map[benefactor.user._id] = {
        totalBenefitted: 0,
        totalPaid: 0,
      };
    }
    map[benefactor.user._id] = {
      totalPaid: currency(benefactor.amountPaid).add(
        map[benefactor.user._id].totalPaid
      ).value,
      totalBenefitted: currency(map[benefactor.user._id].totalBenefitted).add(
        currency(benefactor.amountBenefitted)
      ).value,
    };
  });
  return map;
};

export const budgetPurchasesToBudgetResponse = (
  budget: BudgetType,
  purchases: Purchase[]
): BudgetResponse => {
  const allBudgetUsers = [...budget.owners, ...budget.members];

  let userIdToTotalMap: UserTotalMap = {};
  let total = currency(0);

  purchases.forEach((purchase) => {
    total = total.add(purchase.amount);
    userIdToTotalMap = fromPurchase(purchase, userIdToTotalMap);
  });

  const totals = [] as BudgetResponse['totals'];

  Object.keys(userIdToTotalMap).forEach((key) => {
    totals.push({
      user: allBudgetUsers.filter(
        (u) => u._id.toString() === key
      )[0] as unknown as PurchaseUser,
      totalPaid: userIdToTotalMap[key].totalPaid,
      totalBenefitted: userIdToTotalMap[key].totalBenefitted,
      diff:
        userIdToTotalMap[key].totalPaid - userIdToTotalMap[key].totalBenefitted,
    });
  });

  const response: BudgetResponse = {
    _id: budget._id,
    name: budget.name,
    members: budget.members,
    owners: budget.owners,
    type: budget.type,
    total: total.value,
    purchases: purchases as unknown as Purchase[],
    totals,
  };

  return response;
};
