export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      const newConvo = {...convo}; 
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      const newConvo = {...convo};
      newConvo.id = message.conversationId;
      newConvo.messages.push(message);
      newConvo.latestMessageText = message.text;
      return newConvo;
    } else {
      return convo;
    }
  });
};

export const updateReadStatus = (state, conversationId, senderId, newStatus) => {
  return state.map(convo => {
    if (convo.id === conversationId) {
      const newConvo = {...convo};
      newConvo.messages = newConvo.messages.map(message => {
        if (message.senderId === senderId) {
          const newMessage = {...message};
          newMessage.read = newStatus;
          return newMessage;
        } else {
          return message;
        } 
      });
      return newConvo;
    } else {
      return convo;
    }
  });
}

export const initializeUnreadMessages = (state, payload) => {
  const conversations = {};
  payload.conversations.forEach(convo => {
      conversations[convo.id] = convo.messages.filter(mes => mes.senderId !== payload.userId && !mes.read).length;
  });
  return conversations;
}



export const initializeLastReadMessages = (state, payload) => {
  const conversations = {};
  payload.conversations.forEach(convo => {
      const recipientReadMessages = convo.messages.filter(mes => mes.senderId === payload.userId && mes.read);
      conversations[convo.id] = recipientReadMessages.length > 0 ? recipientReadMessages[recipientReadMessages.length - 1].id : null;
  });
  return conversations;
}