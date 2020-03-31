const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const helmet = require('helmet');
const messageRepository = require('./repositories/MessageRepository');
const userRepository = require('./repositories/UserRepository');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet.noSniff());
app.use(helmet.frameguard({ action: 'deny' }));

app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (await userRepository.getByUsername(username)) return res.status(400).send({ error: 'The username is already taken' });

    await userRepository.create(username, email, password);

    return res.status(204).send();
  } catch (err) {
    return res.status(500).send({ error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await userRepository.getByUsername(username);
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

    const messages = await messageRepository.getAll(numMessages, true);

    return res.send(messages);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

async function getTimeline(userId, numMessages) {
  const user = await userRepository.getById(userId);

  const messages = await messageRepository.getTimeline(user, numMessages);

  return messages;
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

    const profileUser = await userRepository.getByUsername(username);

    if (!profileUser) return res.status(404).send({ error: 'User not found' });

    let following = false;
    if (currentUserId) {
      const currentUser = await userRepository.getById(currentUserId);
      following = await userRepository.isFollowing(currentUser, profileUser);
    }

    const messages = await messageRepository.getMessagesByUser(profileUser, numMessages);

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

    const follower = await userRepository.getById(currentUserId);

    const followed = await userRepository.getByUsername(username);

    if (!follower || !followed) return res.status(404).send({ error: 'User not found' });

    await userRepository.addFollow(follower, followed);

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

    const follower = await userRepository.getById(currentUserId);

    const followed = await userRepository.getByUsername(username);

    if (!follower || !followed) return res.status(404).send({ error: 'User not found' });

    await userRepository.removeFollow(follower, followed);

    return res.status(204).send();
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

app.post('/add_message', async (req, res) => {
  try {
    const { currentUserId, newMessage } = req.body;

    if (!currentUserId) return res.status(401).send({ error: 'currentUserId is missing' });

    const user = await userRepository.getById(currentUserId);

    if (!user) res.status(404).send({ error: 'User not found' });

    await messageRepository.create(user, newMessage);

    const messages = await getTimeline(currentUserId, 50);

    return res.status(201).send(messages);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

module.exports = app;
