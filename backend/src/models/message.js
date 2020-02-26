module.exports = (sequelize, Sequelize) => {
  const Message = sequelize.define('message', {
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    flagged: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  });
  return Message;
};
