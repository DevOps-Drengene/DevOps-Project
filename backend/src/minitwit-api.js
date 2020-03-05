/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const port = process.env.PORT || 5001;

let latest = 0;

function updateLatest(req) {
  if (req.query.latest) {
    latest = parseInt(req.query.latest, 10);
  }
}

function handleError(err, res) {
  if (err.message.toLowerCase().includes('bad request')) {
    console.log(err);
    console.log('--> sent 400');
    return res.status(400).send({ error_msg: err.message });
  }

  if (err.message === 'Unauthorized') {
    console.log(err);
    console.log('--> sent 403');
    return res.status(403).send({ error_msg: 'You are not authorized to use this resource' });
  }

  if (err.message.toLowerCase().includes('not found')) {
    console.log(err);
    console.log('--> sent 404');
    return res.status(404).send({ error_msg: err.message });
  }

  console.log(err);
  console.log('--> sent 500');
  return res.status(500).send({ error_msg: err.message });
}

function notReqFromSimulator(req) {
  const token = req.header('Authorization');
  if (token !== 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh') throw new Error('Unauthorized');
}

const authenticate = require('./routes/authenticate')(updateLatest, notReqFromSimulator, handleError);
const messages = require('./routes/messages')(updateLatest, notReqFromSimulator, handleError);
const follows = require('./routes/follows')(updateLatest, notReqFromSimulator, handleError);

app.use('', authenticate);
app.use('/msgs', messages);
app.use('/fllws', follows);

app.get('/latest', (req, res) => res.send({ latest }));

const server = app.listen(port, () => {
  console.log(`Server started on port: ${port}`);
});

module.exports = { app, server };
