// store.js
import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./authSlice";
import teacherTestReducer from "./teacherTestSlice";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    teacherTests: teacherTestReducer,
  },
});

export default store;
