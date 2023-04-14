import PropTypes from "prop-types";

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={message.type}>
      {message.text}
    </div>
  );
};

Notification
  .propTypes = {
    message: PropTypes.exact({
      text: PropTypes.string,
      type: PropTypes.oneOf(["error", "warning", "info"])
    })
  };
export default Notification;