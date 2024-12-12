import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    notificationChange(state, action) {
      return action.payload;
    },
    clearNotification(state, action) {
      return "";
    },
  },
});

const { notificationChange, clearNotification } = notificationSlice.actions;

// Create a new action creator that handles the timing
export const setNotification = (message, seconds) => {
  return async (dispatch) => {
    dispatch(notificationChange(message));
    setTimeout(() => {
      dispatch(clearNotification());
    }, seconds * 1000);
  };
};

export default notificationSlice.reducer;
