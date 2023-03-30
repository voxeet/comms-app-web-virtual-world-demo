import React, { useEffect } from "react";

import style from "./Messages.Style";

const Messages = ({
  className,
  messages,
  autoDelete,
  autoDeleteTime,
  removeMessageID,
  removeMessage,
}) => {
  useEffect(() => {
    const interval = setInterval(() => {
      if (autoDelete && messages.length && messages.length) {
        deleteMessage(messages[0].id);
      }
    }, autoDeleteTime);

    return () => {
      clearInterval(interval);
    };

    // eslint-disable-next-line
  }, [messages, autoDelete, autoDeleteTime]);

  const deleteMessage = (id) => {
    removeMessageID({ id });
    removeMessage({ id, entityType: "messages" });
  };

  return (
    <div className={className}>
      {messages &&
        messages.length > 0 &&
        messages.map((item, i) => (
          <div key={i} className={`notification`}>
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                deleteMessage(item.id);
              }}
            >
              x
            </button>

            <div className={"notification-data-container"}>
              <p className="notification-title">{item.type}</p>
              <p className="notification-message">{item.message}</p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default style(Messages);
