import logger from '../logger';
import BudgetModel, { BudgetType } from '../models/Budget';
import PurchaseModel from '../models/PurchaseModel';
import { BudgetResponse } from '../types/BudgetResponse';
import { Purchase } from '../types/Purchase';
import { budgetPurchasesToBudgetResponse } from '../utils/budgetPurchasesToBudgetResponse';

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

const getBudgetById = async (
  budgetId,
  userId,
  requireOenwer = false
): Promise<BudgetType> => {
  try {
    const budget: BudgetType = await BudgetModel.findOne(
      createBudgetQuery(budgetId, userId, requireOenwer)
    );
    return Promise.resolve(budget);
  } catch (err) {
    return Promise.reject(err);
  }
};

const getBudget = async (budgetId, userId): Promise<BudgetResponse> => {
  try {
    const budget: BudgetType = await BudgetModel.findOne(
      createBudgetQuery(budgetId, userId, false)
    )
      .populate('owners')
      .populate('members');
    if (budget) {
      const purchases: Purchase[] = await PurchaseModel.find({
        $and: [{ deleted: false }, { budgetId: budget._id }],
      })
        .sort({ createdAt: -1 })
        .populate('benefactors.user')
        .populate('createdBy');

      const response = budgetPurchasesToBudgetResponse(budget, purchases);
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
  let updateQuery = updateData;
  if (updateData.members) {
    updateQuery = { $addToSet: { members: { $each: updateData.members } } };
  }

  const budget = await BudgetModel.findOneAndUpdate(
    createBudgetQuery(budgetId, userId, true),
    { ...updateQuery },
    { new: true }
  );
  await budget.populate('owners');
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

export {
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getUserBudgets,
  getBudgetById,
};
