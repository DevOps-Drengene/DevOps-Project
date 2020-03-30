const db = require('../config/db');

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
    if (includeEmailAndId) {
      return db.message.findAll({
        include: { model: db.user, attributes: [] },
        where: { flagged: false },
        order: [['createdAt', 'DESC']],
        attributes: {
          exclude: ['createdAt', 'updatedAt', 'flagged', 'id'],
          include: [
            'user.username',
            'user.email',
            ['createdAt', 'pubDate'],
          ],
        },
        limit,
        raw: true,
      });
    }
    return db.message.findAll({
      include: { model: db.user, attributes: [] },
      where: { flagged: false },
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt', 'text', 'flagged', 'id'],
        include: [
          [db.sequelize.col('user.username'), 'user'],
          ['createdAt', 'pub_date'],
          ['text', 'content'],
        ],
      },
      limit,
      raw: true,
    });
  },

  async getMessagesByUser(user, limit) {
    return user.getMessages({
      include: { model: db.user, attributes: [] },
      where: { flagged: false },
      order: [['createdAt', 'DESC']],
      attributes: {
        exclude: ['userId', 'createdAt', 'updatedAt', 'text', 'flagged', 'id'],
        include: [
          [db.sequelize.col('user.username'), 'user'],
          ['createdAt', 'pub_date'],
          ['text', 'content'],
        ],
      },
      limit,
      raw: true,
    });
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
