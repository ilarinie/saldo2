import checkAuth from '../checkAuth';
import logger from '../logger';
import PurchaseModel from '../models/PurchaseModel';
import { getBudget } from '../services/budget-service';

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
        const budget = await getBudget(req.body.budgetId, req.user._id);

        const purchase = await PurchaseModel.create({
          amount: req.body.amount,
          payer: req.body.payerId,
          description: req.body.description,
          // @ts-ignore
          budgetId: budget._id,
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
          logger.error(`Error reporting created purchase via websocket ${err}`);
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
