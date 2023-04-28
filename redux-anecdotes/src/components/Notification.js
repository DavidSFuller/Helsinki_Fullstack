import { useSelector } from "react-redux";

const Notification = () => {
  const myState = useSelector((state) => state);
  //console.log("state:", myState);
  const notification = useSelector((state) => myState.notification);

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
  };

  if (notification === null) return null;
  else
    return (
      <div>
        <div style={style}>{notification}</div>
        <p />
      </div>
    );
};

export default Notification;
