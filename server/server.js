const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const WebSocket = require('ws');
const http = require('http');
const logger = require('./logger');
const checkAuth = require('./checkAuth');
const cookieSession = require('cookie-session');
const passport = require('./passport');

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
require('./controllers/authController')(app);
require('./controllers/purchaseController')(app, wss);
require('./controllers/budgetController')(app);

app.get('/api', (req, res) => {
  res.send('Server running A-OK');
});

app.post('/api/checklogin', checkAuth, async (req, res) => {
  res.send('Logged in');
});

if (process.env.NODE_ENV === 'production') {
  logger.info('Serving client');
  app.use(express.static(path.resolve(__dirname, './public')));

  app.get('*', function (req, res) {
    logger.info('fooo');
    res.sendFile(path.resolve(__dirname, './public', 'index.html'));
  });
}

module.exports = {
  server,
  app,
  wss,
};
