import { createSlice } from "@reduxjs/toolkit";
const initialNotification = null; //{text:null, timeoutId:null};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialNotification,
  reducers: {
    notificationSet(state, action) {
      return action.payload;
    },
    notificationClear(state, action) {
      return null;
    },
  },
});

export const { notificationSet, notificationClear } = notificationSlice.actions;

export const setNotification = (text, timeOut, lastTimeOutId) => {
  if (lastTimeOutId) clearTimeout(lastTimeOutId);
  return (dispatch) => {
    const timeoutId = setTimeout(() => {
      dispatch(notificationClear());
    }, timeOut * 1000);
    const notification = { text, timeoutId };
    console.log(notification);
    dispatch(notificationSet(notification));
  };
};

export default notificationSlice.reducer;
