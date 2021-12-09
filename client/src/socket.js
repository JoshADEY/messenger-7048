import io from "socket.io-client";
import store from "./store";
import {
  setNewMessageUnread,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";
import {
  setLastReadMessages
} from "./store/lastReadMessages";
import {
  addMessageThenRead
} from "./store/utils/thunkCreators";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("message-read", (data) => {
    const { user } = store.getState();
    if (data.lastReadMessage.senderId !== user.id) {
      return;
    }
    store.dispatch(setLastReadMessages(data.lastReadMessage));
  });
  socket.on("new-message", (data) => {
    const { activeConversation, conversations, user } = store.getState();

    if (data.recipientId !== user.id) {
      return;
    }

    if (activeConversation) {
      const conversation = conversations.find(convo => convo.otherUser.username === activeConversation);
      if (conversation) {
        if (conversation.otherUser.id === data.message.senderId) {
          data.message.read = true;
          const body = {
            message: data.message,
            sender: data.sender,
            conversationId: conversation.id,
            senderId: conversation.otherUser.id
          }
          store.dispatch(addMessageThenRead(body));
          return;
        }
      }
    }
    store.dispatch(setNewMessageUnread(data.message, data.sender));
  });
});

export default socket;
