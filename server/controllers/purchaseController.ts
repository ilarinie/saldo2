import currency from 'currency.js';
import checkAuth from '../checkAuth';
import logger from '../logger';
import { BudgetType } from '../models/BudgetModel';
import PurchaseModel from '../models/PurchaseModel';
import { getBudgetById } from '../services/budget-service';

const validatePurchase = (purchase: any, budget: BudgetType): boolean => {
  const allMemberIds = [...budget.members, ...budget.owners];
  if (purchase.benefactors.length !== allMemberIds.length) {
    console.log('members');
    return false;
  }
  let total = currency(0);
  let totalBenefits = currency(0);
  purchase.benefactors.forEach((b) => {
    total = total.add(currency(b.amountPaid));
    totalBenefits = totalBenefits.add(currency(b.amountBenefitted));
  });
  if (
    total.value !== currency(purchase.amount).value ||
    totalBenefits.value !== currency(purchase.amount).value
  ) {
    console.log('total');
    console.log(total.value);
    console.log(currency(purchase.amount).value);
    return false;
  }
  return true;
};

const foo = (app, wss) => {
  app.get('/api/purchases', checkAuth, async (req, res) => {
    res.send(await PurchaseModel.find({ deleted: false }));
  });

  app.post('/api/purchases', checkAuth, async (req, res) => {
    if (!req.body.amount || !req.body.description || !req.body.budgetId) {
      res.status(406).send({ message: 'Invalid request' });
    } else {
      logger.info(
        `Trying to create purchase: budgetId: ${req.body.budgetId}, amount: ${req.body.amount}, payerId: ${req.body.payerId}`
      );
      try {
        const budget = await getBudgetById(req.body.budgetId, req.user._id);
        if (validatePurchase(req.body, budget)) {
          const purchase = await PurchaseModel.create({
            amount: req.body.amount,
            description: req.body.description,
            benefactors: req.body.benefactors,
            type: req.body.type,
            // @ts-ignore
            budgetId: budget._id,
            createdBy: req.user._id,
          });
          res.send(purchase);
          try {
            logger.info(`${wss.clients.size} WS clients found`);
            wss.clients.forEach((ws) => {
              if (!ws.isAlive) return ws.terminate();
              ws.isAlive = false;
              ws.ping(null, false, true);
              logger.info('Sending purchase to WS client');
              ws.send(JSON.stringify({ purchase }));
            });
          } catch (err) {
            logger.error(
              `Error reporting created purchase via websocket ${err}`
            );
          }
        } else {
          res.status(406).send('Not good purchase');
        }
      } catch (err) {
        logger.error(`Error creating a purchase: ${err}`);
        res.status(500).send(err);
      }
    }
  });

  app.delete('/api/purchases/:id', checkAuth, async (req, res) => {
    try {
      await PurchaseModel.findByIdAndUpdate(req.params.id, { deleted: true });
      res.status(203).send();
    } catch (err) {
      res.status(500).send(err);
    }
  });
};

export default foo;
