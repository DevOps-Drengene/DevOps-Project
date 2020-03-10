const db = require('../config/db');

function formatMessages(messages) {
  return messages.map((msg) => ({
    content: msg.text,
    pub_date: msg.createdAt,
    user: msg.user.username,
  }));
}

function formatMessages2(messages) {
  return messages.map((msg) => ({
    text: msg.text,
    pubDate: msg.createdAt,
    username: msg.user.username,
    userId: msg.user.id,
    email: msg.user.email,
  }));
}

module.exports = {
  async getAll(limit, includeEmailAndId) {
    const messages = await db.message.findAll({
      include: [db.user],
      where: { flagged: false },
      order: [['createdAt', 'DESC']],
      limit,
    });
    if (includeEmailAndId) return formatMessages2(messages);

    return formatMessages(messages);
  },

  async getMessagesByUser(user, limit) {
    const messages = await user.getMessages({
      include: [db.user],
      where: { flagged: false },
      order: [['createdAt', 'DESC']],
      limit,
    });

    return formatMessages(messages);
  },

  async getTimeline(user, limit) {
    const messages = db.message.findAll({
      where: {
        flagged: false,
        [db.Sequelize.Op.or]: [
          { userId: await user.getFollow().map((flw) => flw.id) },
          { userId: user.id },
        ],
      },
      limit,
      include: [db.user],
      order: [['createdAt', 'DESC']],
    });

    return formatMessages2(messages);
  },

  async isFollowing(followingUser, followedUser) {
    return (await followingUser.getFollow({ where: { id: followedUser.id } })).length > 0;
  },

  async create(user, text) {
    return user.createMessage({ text });
  },
};
