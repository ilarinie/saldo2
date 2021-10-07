import currency from 'currency.js';
import { BudgetType } from '../models/BudgetModel';
import { UserType } from '../models/User';
import { UserTotal } from '../types';
import { BudgetResponse } from '../types/BudgetResponse';
import { Purchase } from '../types/Purchase';
import { PurchaseUser } from '../types/PurchaseUser';

interface UserTotalMap {
  [userId: string]: { totalPaid: number; totalBenefitted: number };
}

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

  const totals = generateBudgetTotals(userIdToTotalMap, allBudgetUsers);

  const { allIds, memberIds, ownerIds, userMap } = generateMemberIds(budget);

  const response: BudgetResponse = {
    _id: budget._id,
    name: budget.name,
    allIds,
    memberIds,
    ownerIds,
    userMap,
    type: budget.type,
    total: total.value,
    purchases: purchases as unknown as Purchase[],
    totals,
  };

  return response;
};

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

type MemberIdType = {
  allIds: string[];
  memberIds: string[];
  ownerIds: string[];
  userMap: { [key: string]: PurchaseUser };
};

const generateMemberIds = (budget: BudgetType): MemberIdType => {
  const ownerIds = [] as string[];
  const memberIds = [] as string[];
  const allIds = [] as string[];
  const userMap: { [key: string]: PurchaseUser } = {};

  budget.owners.forEach((m) => {
    ownerIds.push(m._id);
    allIds.push(m._id);
    userMap[m._id] = m;
  });

  budget.members.forEach((m) => {
    memberIds.push(m._id);
    allIds.push(m._id);
    userMap[m._id] = m;
  });

  return { allIds, memberIds, ownerIds, userMap };
};

const generateBudgetTotals = (
  userIdToTotalMap: UserTotalMap,
  allBudgetUsers: UserType[]
): UserTotal[] => {
  const totals: UserTotal[] = [];
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
  return totals;
};
