const PurchaseModel = require('./PurchaseModel.js');
const checkAuth = require('./checkAuth.js');
const logger = require('./logger');

module.exports = (app, wss) => {
  app.get('/api/purchases', checkAuth, async (req, res) => {
    res.send(await PurchaseModel.find({ deleted: false }));
  });

  app.post('/api/purchases', checkAuth, async (req, res) => {
    if (!req.body.amount || !req.body.description) {
      res.status(406).send({ message: 'Invalid request' });
    } else {
      try {
        const purchase = await PurchaseModel.create({ ...req.body });
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
      console.log(err);
      res.status(500).send(err);
    }
  });
};
