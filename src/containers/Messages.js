import { connect } from "react-redux";
import { createSelector } from "reselect";

import Messages from "../components/technical/messages/Messages";
import { removeMessage } from "../store/effects/message";
import { removeMessageID } from "../store/effects/application";

const getMessageIds = (state) => state.application["@@/data"].messages || [];
const getMessages = (state) => state.entities.messages;

const getData = createSelector(
  [getMessageIds, getMessages],
  (messagesIds, messages) => {
    return messagesIds.map((id) => {
      const { type, message } = messages[id];
      return { type, message, id };
    });
  }
);

const mapStateToProps = (state) => {
  return {
    messages: getData(state),
  };
};

const mapDispatchToProps = {
  removeMessage,
  removeMessageID,
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
