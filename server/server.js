'use strict'

// npm modules
const express = require('express');
const app = express();
// our modules

const port = 80;

const server = app.listen(port);
app.use('/', express.static('client', {'extensions': ['html']}));

const io = require('socket.io')(server);

// http verbs
app.get('/api/game', getTest);

async function getTest(req, res) {
  res.json({'key': "hi"});
}

console.log('Server listening on port:', port);
