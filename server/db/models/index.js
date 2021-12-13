const Conversation = require("./conversation");
const User = require("./user");
const Message = require("./message");
const User_Conversation = require("./userConversation");

// associations

// Super Many-to-Many rel. between User and Conversation through User_Conversation
// Super Many-to-Many allows for flexibility when eager loading
User.belongsToMany(Conversation, { through: User_Conversation});
Conversation.belongsToMany(User, { through: User_Conversation});
User.hasMany(User_Conversation);
User_Conversation.belongsTo(User);
Conversation.hasMany(User_Conversation);
User_Conversation.belongsTo(Conversation);

// One-to-Many rel. between Conversation and Message
Message.belongsTo(Conversation);
Conversation.hasMany(Message);

module.exports = {
  User,
  Conversation,
  Message,
  User_Conversation,
};
