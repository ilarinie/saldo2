import checkAuth from '../checkAuth';
import logger from '../logger';
import * as BudgetService from '../services/budget-service';
import * as UserService from '../services/user-service';

const foo = (app) => {
  app.get('/api/budgets', checkAuth, async (req, res) => {
    const budgets = await BudgetService.getUserBudgets(req.user._id);
    res.status(200).send({ resp: budgets });
  });

  app.get('/api/budgets/:id', checkAuth, async (req, res) => {
    try {
      const budget = await BudgetService.getBudget(req.params.id, req.user._id);
      res.status(200).send({ resp: budget });
    } catch (err) {
      logger.error(err);
      res.status(403).send('Forbidden');
    }
  });

  app.post('/api/budgets', checkAuth, async (req, res) => {
    try {
      const budget = await BudgetService.createBudget(req.body, req.user._id);
      res.status(200).send({ resp: budget });
    } catch (err) {
      logger.error(err);
      res.status(406).send(err);
    }
  });

  app.put('/api/budgets/:id', checkAuth, async (req, res) => {
    try {
      const budget = await BudgetService.updateBudget(
        req.params.id,
        req.user._id,
        req.body
      );
      res.status(200).send({ resp: budget });
    } catch (err) {
      logger.error(err);
      res.status(406).send(err);
    }
  });

  app.delete('/api/budgets/:id', checkAuth, async (req, res) => {
    try {
      await BudgetService.deleteBudget(req.params.id, req.user._id);
      res.status(203).send({ resp: 'OK' });
    } catch (err) {
      logger.error(err);
      res.status(406).send(err);
    }
  });

  app.post('/api/budgets/:id/addnewusers', checkAuth, async (req, res) => {
    const { username, budgetId } = req.body;
    if (!username || !budgetId) {
      res.status(400).send('No username or budgetId');
      return;
    }
    try {
      const budget = await BudgetService.getBudgetById(
        budgetId,
        req.user._id,
        true
      );
      if (budget) {
        const newUser = await UserService.createUserByUserName(username);
        await BudgetService.updateBudget(budgetId, req.user._id, {
          members: [newUser._id],
        });
        res.status(200).send('Success');
      } else {
        res.status(403).send('Forbidden');
        return;
      }
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
};

export default foo;
