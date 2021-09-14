import logger from '../logger';
import BudgetModel, { BudgetType } from '../models/Budget';
import PurchaseModel, { PurchaseType } from '../models/PurchaseModel';
import { BudgetResponse, PurchaseUser } from '../types/BudgetResponse';

const createBudgetQuery = (budgetId, userId, requireOwner) => {
  return {
    $and: [
      { _id: budgetId },
      { deleted: false },
      ownerOrMemberQuery(userId, requireOwner),
    ],
  };
};

const ownerOrMemberQuery = (userId, requireOwner) => {
  if (requireOwner) {
    return {
      owners: {
        $in: [userId],
      },
    };
  }
  return {
    $or: [
      {
        members: {
          $in: [userId],
        },
      },
      {
        owners: {
          $in: [userId],
        },
      },
    ],
  };
};

const getBudget = async (budgetId, userId): Promise<BudgetResponse> => {
  try {
    const budget: BudgetType = await BudgetModel.findOne(
      createBudgetQuery(budgetId, userId, false)
    )
      .populate('owners')
      .populate('members');
    if (budget) {
      const purchases: PurchaseType[] = await PurchaseModel.find({
        $and: [{ deleted: false }, { budgetId: budget._id }],
      }).populate('payer');

      const allBudgetUsers = [...budget.owners, ...budget.members];

      const userIdToTotalMap: { [key: string]: number } = {};
      let total = 0;

      purchases.forEach((purchase) => {
        total = total + purchase.amount;
        if (!userIdToTotalMap[purchase.payer._id]) {
          userIdToTotalMap[purchase.payer._id] = 0;
        }
        userIdToTotalMap[purchase.payer._id] =
          userIdToTotalMap[purchase.payer._id] + purchase.amount;
      });

      const average = total / allBudgetUsers.length;

      const totals = [] as BudgetResponse['totals'];

      if (Object.keys(userIdToTotalMap).length < allBudgetUsers.length) {
        const keys = Object.keys(userIdToTotalMap);
        const notPresent = allBudgetUsers.filter(
          (u) => !keys.includes(u._id.toString())
        );
        notPresent.forEach((u) => {
          userIdToTotalMap[u._id] = 0;
        });
      }

      Object.keys(userIdToTotalMap).forEach((key) => {
        totals.push({
          user: allBudgetUsers.filter(
            (u) => u._id.toString() === key
          )[0] as unknown as PurchaseUser,
          saldo: userIdToTotalMap[key] - average,
        });
      });

      const response: BudgetResponse = {
        _id: budget._id,
        name: budget.name,
        members: budget.members,
        owners: budget.owners,
        total,
        purchases,
        totals,
      };
      return Promise.resolve(response);
    } else {
      throw Error('budget not found or not accesible');
    }
  } catch (err) {
    throw Error(`Budget not accesible for user ${userId}`);
  }
};

const createBudget = async (budget, userId) => {
  const newBudget = await BudgetModel.create({
    ...budget,
    owners: [userId],
  });
  return await newBudget.populate('owners');
};

const updateBudget = async (budgetId, userId, updateData) => {
  const budget = await BudgetModel.findOneAndUpdate(
    createBudgetQuery(budgetId, userId, true),
    { ...updateData },
    { new: true }
  );
  // @ts-ignore
  await budget.populate('owners');
  // @ts-ignore
  await budget.populate('members');
  return budget;
};

const deleteBudget = async (budgetId, userId) => {
  return updateBudget(budgetId, userId, { deleted: true });
};

const getUserBudgets = async (userId) => {
  let res: BudgetType[] = [];
  try {
    res = await BudgetModel.find({
      $and: [ownerOrMemberQuery(userId, false), { deleted: false }],
    });
    const budgets = await Promise.all([
      ...res.map((r) => getBudget(r._id, userId)),
    ]);
    return Promise.resolve(budgets);
  } catch (err) {
    logger.error(err);
  }

  return Promise.resolve(res);
};

export { getBudget, createBudget, updateBudget, deleteBudget, getUserBudgets };
