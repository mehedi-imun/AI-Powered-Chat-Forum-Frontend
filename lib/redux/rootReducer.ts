import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import notificationReducer from "./slices/notificationSlice";

export const rootReducer = combineReducers({
  auth: authReducer,
  ui: uiReducer,
  notification: notificationReducer,
});
