const dotenv = require('dotenv');
dotenv.config();

const  express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const path = require('path')
const WebSocket = require('ws');
const http = require('http');

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log('connected to mongo')
})

const PurchaseSchema = new mongoose.Schema({
    amount: { type: Number },
    description: { type: String },
},
{
    timestamps: true
})

const PurchaseModel = mongoose.model('Purchase', PurchaseSchema);

const app = express();

const server = http.createServer(app);

const wss = new WebSocket.Server({ server, path: "/ws"});

app.use(bodyParser.json());

const checkAuth = (req, res, next) => {
    const token = req.header('Authorization')
    if (token === process.env.SECRET) {
        next();
    } else {
        res.status(401).send('Unauthorized biatch')
    }
}


app.get('/api/purchases', checkAuth,  async (req, res) => {
    res.send(await PurchaseModel.find({}));
})

app.post('/api/purchases', checkAuth,  async (req, res) => {
    if (!req.body.amount || !req.body.description) {
        res.status(406).send('REE')
    }

    const purchase = await PurchaseModel.create({ ...req.body });
    wss.clients.forEach(ws => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping(null, false, true);
        console.log('sending')
        ws.send(JSON.stringify({ purchase }))
    })
    res.send(purchase);
})

app.delete('/api/purchases/:id', checkAuth, async (req, res) => {
    try {

        await PurchaseModel.findByIdAndDelete(req.params.id);
        res.status(203).send();
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, '../build')));

    app.get('*', function (req, res) {
        res.sendFile(path.resolve(__dirname, '../build', 'index.html'))
    });
}



const port = process.env.PORT || 3001

wss.on('connection', (ws) => {
    console.log('connected')

    ws.isAlive = true;

    ws.on('pong', () => {
        ws.isAlive = true;
    });

});


server.listen(port, () => {
    console.log('Listening to ', port)
    setInterval(() => {
        
    }, 5000);
})