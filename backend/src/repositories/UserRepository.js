const db = require('../config/db');

module.exports = {
  async getByUsername(username) {
    return db.user.findOne({ where: { username } });
  },

  async create(username, email, password) {
    return db.user.create({ username, email, password });
  },

  async addFollow(fromUser, toUser) {
    return fromUser.addFollow(toUser);
  },

  async removeFollow(fromUser, toUser) {
    return fromUser.removeFollow(toUser);
  },

  async getFollowing(user, limit) {
    return user.getFollow({ limit });
  },
};
