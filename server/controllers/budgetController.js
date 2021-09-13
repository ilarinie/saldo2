const checkAuth = require('../checkAuth');
const logger = require('../logger');
const BudgetService = require('../services/budget-service');

module.exports = (app) => {
  app.get('/api/budgets', checkAuth, async (req, res) => {
    console.log(req.user);
    const budgets = await BudgetService.getUserBudgets(req.user._id);
    console.log(budgets);
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
};
