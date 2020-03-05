const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const db = require('./config/db');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (await db.user.findOne({ where: { username } })) return res.status(400).send({ error: 'The username is already taken' });

    await db.user.create({ username, email, password });

    return res.status(204).send();
  } catch (err) {
    return res.status(400).send({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db.user.findOne({ where: { username } });
    if (!user) return res.status(400).send({ error: 'Unknown user' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send({ error: 'That did not work. Try again.' });

    // cut out the password
    return res.send({ userId: user.id, username: user.username, email: user.email });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get('/public', async (req, res) => {
  try {
    const { numMessages = 50 } = req.body;

    const messages = await db.message.findAll({
      where: { flagged: false },
      order: [['createdAt', 'DESC']],
      limit: numMessages,
      include: [db.user],
    });

    return res.send(messages.map((msg) => ({
      text: msg.text,
      pubDate: msg.createdAt,
      userId: msg.user.id,
      username: msg.user.username,
      email: msg.user.email,
    })));
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

async function getTimeline(userId, numMessages) {
  const user = await db.user.findByPk(userId);

  const messages = await db.message.findAll({
    where: {
      flagged: false,
      [db.Sequelize.Op.or]: [
        { userId: await user.getFollow().map((flw) => flw.id) },
        { userId: user.id },
      ],
    },
    limit: numMessages,
    include: [db.user],
    order: [['createdAt', 'DESC']],
  });

  return (messages.map((msg) => ({
    text: msg.text,
    pubDate: msg.createdAt,
    userId: msg.user.id,
    username: msg.user.username,
    email: msg.user.email,
  })));
}

app.get('/timeline/:userId', async (req, res) => {
  try {
    // numMessages defaults to 50
    const { numMessages = 50 } = req.body;
    const { userId } = req.params;

    const messages = await getTimeline(userId, numMessages);

    return res.send(messages);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.get('/user/:username/:currentUserId?', async (req, res) => {
  try {
    const { username, currentUserId } = req.params;
    const { numMessages = 50 } = req.body;

    const profileUser = await db.user.findOne({ where: { username } });

    if (!profileUser) return res.status(404).send({ error: 'User not found' });

    let following = false;
    if (currentUserId) {
      const currentUser = await db.user.findByPk(currentUserId);
      const followingRes = await currentUser.getFollow({ where: { id: profileUser.id } });
      following = !!(followingRes.length);
    }

    const messages = await profileUser.getMessages({
      order: [['createdAt', 'DESC']],
      limit: numMessages,
    });

    return res.send({
      profileUser: {
        userId: profileUser.id,
        username: profileUser.username,
        email: profileUser.email,

      },
      following,
      messages: messages.map((msg) => ({
        author_id: profileUser.id,
        userId: profileUser.id,
        text: msg.text,
        pubDate: msg.createdAt,
        username: profileUser.username,
        email: profileUser.email,
      })),
    });
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post('/:username/follow', async (req, res) => {
  try {
    const { currentUserId } = req.body;
    const { username } = req.params;

    if (!currentUserId) return res.status(401).send({ error: 'currentUserId is missing' });

    const follower = await db.user.findByPk(currentUserId);

    const followed = await db.user.findOne({ where: { username } });

    if (!follower || !followed) return res.status(404).send({ error: 'User not found' });

    await follower.addFollow(followed);

    return res.status(204).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post('/:username/unfollow', async (req, res) => {
  try {
    const { currentUserId } = req.body;
    const { username } = req.params;

    if (!currentUserId) return res.status(401).send({ error: 'currentUserId is missing' });

    const follower = await db.user.findByPk(currentUserId);

    const followed = await db.user.findOne({ where: { username } });

    if (!follower || !followed) return res.status(404).send({ error: 'User not found' });

    await follower.removeFollow(followed);

    return res.status(204).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post('/add_message', async (req, res) => {
  try {
    const { currentUserId, newMessage } = req.body;

    if (!currentUserId) return res.status(401).send({ error: 'currentUserId is missing' });

    const user = await db.user.findByPk(currentUserId);

    if (!user) throw new Error('User not found');

    await user.createMessage({ text: newMessage });

    const messages = await getTimeline(currentUserId);

    return res.status(201).send(messages);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = app;
