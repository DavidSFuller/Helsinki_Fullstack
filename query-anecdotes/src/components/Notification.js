import { useNotificationValue } from "./NotificationContext";

const Notification = () => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  };

  const notification = useNotificationValue();
  if (notification === null || !notification.text) {
    return null;
  } else {
    //console.log("notification:", notification);
    return <div style={style}>{notification.text}</div>;
  }
};

export default Notification;
