import { createSlice, current } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "Initial",
  reducers: {
    notificationChange(state, action) {
      // console.log(current(state));
      return action.payload;
    },
  },
});

export const { notificationChange } = notificationSlice.actions;
export default notificationSlice.reducer;
