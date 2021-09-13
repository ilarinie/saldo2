const logger = require('../logger');
const BudgetModel = require('../models/Budget');
const PurchaseModel = require('../models/PurchaseModel');

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

const getBudget = async (budgetId, userId) => {
  const budget = await BudgetModel.findOne(
    createBudgetQuery(budgetId, userId, false)
  )
    .populate('owners')
    .populate('members');
  const purchases = await PurchaseModel.find({
    $and: [{ deleted: false }, { budgetId: budget._id }],
  });
  if (budget) {
    return { budget, purchases };
  }
  throw Error(`Budget not accesible for user ${userId}`);
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
  await budget.populate('owners');
  await budget.populate('members');
  return budget;
};

const deleteBudget = async (budgetId, userId) => {
  return updateBudget(budgetId, userId, { deleted: true });
};

const getUserBudgets = async (userId) => {
  let res = [];
  try {
    res = await BudgetModel.find({
      $and: [ownerOrMemberQuery(userId, false), { deleted: false }],
    })
      .populate('owners')
      .populate('members')
      .exec();
  } catch (err) {
    logger.error(err);
  }

  return Promise.resolve(res);
};

module.exports = {
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget,
  getUserBudgets,
};
