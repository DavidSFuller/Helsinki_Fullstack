import { createContext, useReducer, useContext } from "react";

const NotificationContext = createContext();
//console.log('NotificationContext:', NotificationContext);

const initialState = {text: null, timeoutId:null};

const notificationReducer = (state, action) => {
  //console.log('action:', action);
  return action;
};

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    initialState
  );
  //console.log("NotificationContextProvider", props);
  if (notification === null) {
    //console.log('notification was null');
    return props.children;
  } else
    //console.log(notification, notificationDispatch);
    return (
      <NotificationContext.Provider
        value={[notification, notificationDispatch]}
      >
        {props.children}
      </NotificationContext.Provider>
    );
};

export const useNotificationValue = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  //console.log('notificationAndDispatch:', notificationAndDispatch);
  if (notificationAndDispatch) return notificationAndDispatch[0];
  else return null;
};

export const useNotificationDispatch = () => {
  const notificationAndDispatch = useContext(NotificationContext);
  //console.log('notificationAndDispatch:',notificationAndDispatch)
  if (notificationAndDispatch) return notificationAndDispatch[1];
  else return null;
};

export default NotificationContext;
