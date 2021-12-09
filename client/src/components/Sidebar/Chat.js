import React from "react";
import { Badge, Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { setActiveChat } from "../../store/activeConversation";
import { readMessages } from "../../store/utils/thunkCreators";
import { connect } from "react-redux";

const useStyles = makeStyles((theme) => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    "&:hover": {
      cursor: "grab"
    }
  },
  left: {
    display: "flex",
    alignItems: "center",
  }

}));

const Chat = (props) => {
  const classes = useStyles();
  const { conversation } = props;
  const { otherUser } = conversation;
  const numberOfUnreadMessages = props.unreadMessages[conversation.id] !== undefined ? props.unreadMessages[conversation.id] : 0;

  const handleClick = async (conversation) => {
    await props.setActiveChat(conversation.otherUser.username);
    if (conversation.id) {
      await props.readMessages({ conversationId: conversation.id, senderId: conversation.otherUser.id })
    }
  };

  return (
    <Box onClick={() => handleClick(conversation)} className={classes.root}>
      <Box className={classes.left}>
        <BadgeAvatar
          photoUrl={otherUser.photoUrl}
          username={otherUser.username}
          online={otherUser.online}
          sidebar={true}
        />
        <ChatContent conversation={conversation} />
      </Box>
      <Box>
        <Badge badgeContent={numberOfUnreadMessages} color="primary" />
      </Box>
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    unreadMessages: state.unreadMessages
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveChat: (id) => {
      dispatch(setActiveChat(id));
    },
    readMessages: (body) => {
      dispatch(readMessages(body));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
