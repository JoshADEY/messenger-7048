const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;

    // if we already know conversation id, we can save time and just add it to message and return
    if (conversationId) {
      const message = await Message.create({ senderId, text, conversationId });
      return res.json({ message, sender });
    }
    // if we don't have conversation id, find a conversation to make sure it doesn't already exist
    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.post("/read-messages", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const { conversationId, senderId } = req.body;

    let conversation = await Conversation.findConversation(
      senderId,
      userId
    );

    if (!conversation) {
      return res.sendStatus(404);
    }

    if (conversation.id !== conversationId) {
      return res.sendStatus(401);
    }

    const result = await Message.update({ read: true }, {
      where: {
        [Op.and]: [
          { conversationId: conversationId },
          { senderId: senderId },
          { read: false }
        ]
      },
      returning: true,
      plain: true
    });

    // Note: the PostgreSQL database seems to only return the first message that was updated when result[1] or result[1].dataValues is called
    // but it is actually supposed to return all the updated messages, so I will send back the senderId to use as a way to update the read status of the messages on the client
    const updatedMessages = result[1];

    return res.json({ updatedMessages, conversationId, senderId });


  } catch (error) {
    next(error);
  }
});
module.exports = router;
