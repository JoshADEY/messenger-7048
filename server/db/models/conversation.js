const Sequelize = require("sequelize");
const { Op } = Sequelize;
const db = require("../db");
const Message = require("./message");

const Conversation = db.define("conversation", {
  title: {
    type: Sequelize.STRING,
  },
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  creatorId: {
    type: Sequelize.INTEGER,
  }
});

// below commented code is not needed anymore as the relationship between User and Conversation has changed
// find conversation given two user Ids

// Conversation.findConversation = async function (user1Id, user2Id) {
//   const conversation = await Conversation.findOne({
//     where: {
//       user1Id: {
//         [Op.or]: [user1Id, user2Id]
//       },
//       user2Id: {
//         [Op.or]: [user1Id, user2Id]
//       }
//     }
//   });

//   // return conversation or null if it doesn't exist
//   return conversation;
// };

module.exports = Conversation;
