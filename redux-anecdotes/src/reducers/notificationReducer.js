import { createSlice } from "@reduxjs/toolkit";
const initialNotification = null;

const notificationSlice = createSlice({
    name: "notification",
    initialState: initialNotification,
    reducers: {
      notificationSet(state, action) {
        return action.payload;
      },
      notificationClear(state, action) {
        return null;
      }
    }
});

export const { notificationSet, notificationClear } = notificationSlice.actions;
export default notificationSlice.reducer;
