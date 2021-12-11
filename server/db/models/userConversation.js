const Sequelize = require("sequelize");
const db = require("../db");

const User_Conversation = db.define("user_conversation", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  lastReadMessageId: {
    type: Sequelize.INTEGER,
  }
});

module.exports = User_Conversation;