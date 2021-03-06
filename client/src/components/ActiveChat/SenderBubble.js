import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box, Typography, Avatar } from "@material-ui/core";
import { connect } from "react-redux";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end"
  },
  avatar: {
    height: 20,
    width: 20,
    marginTop: 8
  },
  date: {
    fontSize: 11,
    color: "#BECCE2",
    fontWeight: "bold",
    marginBottom: 5
  },
  text: {
    fontSize: 14,
    color: "#91A3C0",
    letterSpacing: -0.2,
    padding: 8,
    fontWeight: "bold"
  },
  bubble: {
    background: "#F4F6FA",
    borderRadius: "10px 10px 0 10px"
  }
}));

const SenderBubble = (props) => {
  const classes = useStyles();
  const { time, text, lastReadMessages, conversationId, messageId, otherUser } = props;
  return (
    <Box className={classes.root}>
      <Typography className={classes.date}>{time}</Typography>
      <Box className={classes.bubble}>
        <Typography className={classes.text}>{text}</Typography>
      </Box>
      {lastReadMessages[conversationId] === messageId &&
        <Avatar alt={otherUser.username} src={otherUser.photoUrl} className={classes.avatar} />
      }
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    lastReadMessages: state.lastReadMessages
  };
};

export default connect(mapStateToProps)(SenderBubble);
