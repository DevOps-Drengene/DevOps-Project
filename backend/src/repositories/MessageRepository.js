const db = require('../config/db');

function formatMessages(messages) {
  return messages.map((msg) => ({
    content: msg.text,
    pub_date: msg.createdAt,
    user: msg.user.username,
  }));
}

module.exports = {
  async getAll(limit) {
    const messages = await db.message.findAll({
      include: [db.user],
      where: { flagged: false },
      order: [['createdAt', 'DESC']],
      limit,
    });

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

  async create(user, text) {
    return user.createMessage({ text });
  },
};
