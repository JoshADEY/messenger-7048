import { initializeLastReadMessages } from "./utils/reducerFunctions";
// ACTIONS

const GET_LAST_READ_MESSAGES = "GET_LAST_READ_MESSAGES";
const SET_LAST_READ_MESSAGE = "SET_LAST_READ_MESSAGE";

// ACTION CREATORS

export const gotLastReadMessages = (conversations, userId) => {
    return {
      type: GET_LAST_READ_MESSAGES,
      payload: { conversations, userId },
    };
};


export const setLastReadMessages = (message) => {
    return {
      type: SET_LAST_READ_MESSAGE,
      payload: { message },
    };
};


// REDUCER
// state will be map of conversationId to id of last read message
const reducer = (state = {}, action) => {
    switch (action.type) {
      case GET_LAST_READ_MESSAGES: 
        return initializeLastReadMessages(state, action.payload);
      case SET_LAST_READ_MESSAGE: {
            const conversationId = action.payload.message.conversationId;
            return {
                ...state,
                [conversationId]: action.payload.message.id
            }
        }
      default:
        return state;
    }
};
  
  export default reducer;