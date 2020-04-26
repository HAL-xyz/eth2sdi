const express = require('express');
const bodyParser = require('body-parser');

// Lib
const { createInvoice } = require('./lib/createInvoice.js');

// Const
const { merchant } = require('./const/merchant.js');

// App
const app = express();
const PORT = 3000;

app.use(bodyParser.json());

app.post('/hook', (req, res) => {
  createInvoice(merchant, req.body);
  res.status(200).end();
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
