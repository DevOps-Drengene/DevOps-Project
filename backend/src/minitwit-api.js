const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
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
  if (err.message === 'User not found') {
    res.status(404).send({ error: err.message });
    console.error(`${err.name}: ${err.message} --> sent 404`);
  } else {
    res.status(500).send({ error: err.message });
    console.error(`${err.name}: ${err.message} --> sent 500`);
  }
}

function notReqFromSimulator(req, res) {
  const token = req.header('Authorization');
  if (token !== 'Basic c2ltdWxhdG9yOnN1cGVyX3NhZmUh') {
    res.status(403).send({ error_msg: 'You are not authorized to use this resource' });
    throw new Error('You are not authorized to use this resource');
  }
}

app.get('/latest', (req, res) => res.send({ latest }));

app.post('/register', async (req, res) => {
  try {
    const { username, email, pwd } = req.body;

    updateLatest(req);

    if (await db.user.findOne({ where: { username } }))
      throw new Error('The username is already taken');

    await db.user.create({ username, email, password: pwd });

    return res.status(204).send();
  } catch (err) {
    return handleError(err, res);
  }
});

app.get('/msgs', async (req, res) => {
  try {
    updateLatest(req);

    const { no: noMsgs = 100 } = req.query;

    const messages = await db.message.findAll({
      include: [db.user],
      where: { flagged: false },
      order: [['createdAt', 'DESC']],
      limit: noMsgs
    }).then(
      res => res.map(msg => {
        return {
          content: msg.text,
          pub_date: msg.createdAt,
          user: msg.user.username
        };
      })
    );

    return res.send(messages);
  } catch (err) {
    return handleError(err, res);
  }
});

app.get('/msgs/:username', async (req, res) => {
  try {
    updateLatest(req);

    const { no: noMsgs = 100 } = req.query;

    const user = await db.user.findOne({ where: { username: req.params.username } });

    if (user === null)
      throw new Error('User not found');

    const messages = await user.getMessages({
      where: { flagged: false },
      order: [['createdAt', 'DESC']],
      limit: noMsgs
    }).then(
      res => res.map(msg => {
        return {
          content: msg.text,
          pub_date: msg.createdAt,
          user: user.username
        };
      })
    );

    return res.send(messages);
  } catch (err) {
    return handleError(err, res);
  }
});

app.post('/msgs/:username', async (req, res) => {
  try {
    updateLatest(req);
    notReqFromSimulator(req, res);

    const user = await db.user.findOne({ where: { username: req.params.username } });

    if (user === null)
      throw new Error('User not found');

    await user.createMessage({ text: req.body.content });

    return res.status(204).send();
  } catch (err) {
    return handleError(err, res);
  }
});

app.get('/fllws/:username', async (req, res) => {
  try {
    updateLatest(req);
    notReqFromSimulator(req);

    const { no: noFollowers = 100 } = req.body;

    const user = await db.user.findOne({ where: { username: req.params.username } });

    if (user === null)
      throw new Error('User not found');
    
    const follows = await user.getFollow({ limit: noFollowers })
      .then(res => res.map(flw => flw.username));

    res.send({ follows });
  } catch (err) {
    return handleError(err, res);
  }
});

app.post('/fllws/:username', async (req, res) => {
  try {
    updateLatest(req);
    notReqFromSimulator(req);

    const user = await db.user.findOne({ where: { username: req.params.username } });

    if (user === null)
      throw new Error('User not found');

    const keys = Object.keys(req.body);

    if (keys.includes('follow')) {
      const followed = await db.user.findOne({ where: { username: req.body.follow } });

      if (followed === null)
        throw new Error('User not found');

      await user.addFollow(followed);

      return res.status(204).send();
    }

    if (keys.includes('unfollow')) {
      const unfollowed = await db.user.findOne({ where: { username: req.body.unfollow } });

      if (unfollowed === null)
        throw new Error('User not found');

      await user.removeFollow(unfollowed);

      return res.status(204).send();
    }
  } catch (err) {
    return handleError(err, res);
  }
});

// It will wipe the database upon each startup
db.sequelize.sync({ force: true }).then(async () => {
  app.listen(port, () => {
    console.log(`Server started on port: ${port}`);
  });
});
