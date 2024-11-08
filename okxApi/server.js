const WebSocket = require('ws');
const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

//const wss = new WebSocket.Server({ port: 8080 });

let data = [];

const wsUrl = 'wss://ws.okx.com:8443/ws/v5/business?brokerId=9999';

app.use(express.static('public'));


const wss = new WebSocket(wsUrl);

wss.on('message', (message) => {
  const jsonData = JSON.parse(message);
 // console.log(message)
  console.log('Received message:', message.toString());
  if (jsonData.success) {
    const instrumentData = jsonData.args[0];
    const price = instrumentData.price;
    const timestamp = instrumentData.timestamp;
    data.push({ price, timestamp });
  }
});

wss.on('open', () => {
  console.log('Connected to OKX API');
  wss.send(JSON.stringify({
   "op": "subscribe",
  "args": [
    {
      "channel": "candle1s",
      "instId": "MYRIA-USDT",
      "instType": "SPOT",
    }
    
  ]
  }
));

  wss.on('close', () => {
    console.log('Client disconnected');
  });
});

app.use(cors());

app.get('/data', (req, res) => {
  res.json(data);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3008, () => {
  console.log('Server started on port 3008');
});