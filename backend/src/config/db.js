const Sequelize = require('sequelize');

const sequelize = new Sequelize(
  process.env.PSQL_DB_NAME,
  process.env.PSQL_DB_USER_NAME,
  process.env.PSQL_DB_USER_PASSWORD,
  {
    host: process.env.PSQL_HOST_NAME || 'localhost',
    port: process.env.PSQL_HOST_PORT || 5432,
    dialect: 'postgres',
    pool: { max: 30 },
    logging: false,
    dialectOptions: {
      ssl: process.env.PSQL_SSL_ENABLE || false,
    },
  },
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require('../models/user.js')(sequelize, Sequelize);
db.message = require('../models/message.js')(sequelize, Sequelize);

db.user.hasMany(db.message);
db.message.belongsTo(db.user);
db.user.belongsToMany(db.user, { as: 'Follow', through: 'followers' });

module.exports = db;
