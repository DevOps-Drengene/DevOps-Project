const db = require('../config/db');

module.exports = {
  async getByUsername(username) {
    return db.user.findOne({ where: { username } });
  },

  async getById(id) {
    return db.user.findByPk(id);
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

  async numberOfUsers() {
    return db.user.count();
  },

  async isFollowing(follower, followed) {
    return follower.hasFollow(followed);
  },
};
