import bodyParser from 'body-parser';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
import WebSocket from 'ws';
import checkAuth from './checkAuth';
import authController from './controllers/authController';
import budgetController from './controllers/budgetController';
import purchaseController from './controllers/purchaseController';
import logger from './logger';
import passport from './passport';

dotenv.config();

const app = express();

app.use(
  cookieSession({
    secret: 'asdasdasd',
  })
);

app.use(passport.initialize());
app.use(passport.session());

const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: '/ws' });

wss.on('connection', (ws, socket, request) => {
  logger.debug('Websocket connection opened');

  ws.isAlive = true;

  ws.on('pong', () => {
    ws.isAlive = true;
  });
});

app.use(bodyParser.json());
authController(app);
purchaseController(app, wss);
budgetController(app);

app.get('/api', (req, res) => {
  res.send('Server running A-OK');
});

app.post('/api/checklogin', checkAuth, async (req, res) => {
  res.send(req.user);
});

if (process.env.NODE_ENV === 'production') {
  logger.info('Serving client');
  app.use(express.static(path.resolve(__dirname, './public')));

  app.get('*', function (req, res) {
    logger.info('fooo');
    res.sendFile(path.resolve(__dirname, './public', 'index.html'));
  });
}

export { server, app, wss };
