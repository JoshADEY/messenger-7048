import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";
import {
  readMessages
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
  socket.on("new-message", (data) => {
    const { activeConversation, conversations } = store.getState();
    if (activeConversation) {
      const conversation = conversations.find(convo => convo.otherUser.username === activeConversation);
      if (conversation) {
        if (conversation.otherUser.id === data.message.senderId) {
          data.message.read = true;
          store.dispatch(setNewMessage(data.message, data.sender));
          store.dispatch(readMessages({ conversationId: conversation.id, senderId: conversation.otherUser.id }));

        } else {
          store.dispatch(setNewMessage(data.message, data.sender));
        }
      } else {
        store.dispatch(setNewMessage(data.message, data.sender));
      }
    } else {
      store.dispatch(setNewMessage(data.message, data.sender));
    }
  });
});

export default socket;
