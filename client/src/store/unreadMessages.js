import { SET_MESSAGE_UNREAD, MESSAGES_READ } from "./conversations";
import { initializeUnreadMessages } from "./utils/reducerFunctions";

// ACTIONS

const GET_UNREAD_MESSAGES = "GET_UNREAD_MESSAGES";

// ACTION CREATORS

export const gotUnreadMessages = (conversations, userId) => {
    return {
      type: GET_UNREAD_MESSAGES,
      payload: { conversations, userId },
    };
};


// REDUCER
// state will be map of conversationId to number of unread messages for the user
const reducer = (state = {}, action) => {
    switch (action.type) {
      case GET_UNREAD_MESSAGES: 
        return initializeUnreadMessages(state, action.payload);
      case SET_MESSAGE_UNREAD: {
            const conversationId = action.payload.message.conversationId;
            return {
                ...state,
                [conversationId]: state[conversationId] !== undefined? state[conversationId] + 1: 1
            }
        }
        case MESSAGES_READ: {
            const conversationId = action.payload.conversationId;
            return {
                ...state,
                [conversationId]: 0
            }
        }
      default:
        return state;
    }
};
  
  export default reducer;