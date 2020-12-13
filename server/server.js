const dotenv = require('dotenv');
dotenv.config();

const  express = require('express');
const bodyParser = require('body-parser')
const path = require('path')
const WebSocket = require('ws');
const http = require('http');
const logger = require('./logger');
const checkAuth = require('./checkAuth');



const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: "/ws"});

wss.on('connection', (ws, socket, request) => {
    logger.debug('Websocket connection opened');

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });
});

app.use(bodyParser.json());

require('./purchaseController')(app, wss);

app.get('/', (req, res) => {
    res.send('Server running A-OK')
})

app.post("/api/checklogin", checkAuth, async (req, res) => {
    res.send("Logged in");
  });

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../build')));

    app.get('*', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'))
    });
}







module.exports = {
    server,
    app,
    wss
};