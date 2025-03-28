import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./authSlice";
import teacherTestReducer from "./teacherTestSlice";
import studentTestReducer from "./studentTestSlice"; // your reducer

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    teacherTests: teacherTestReducer,
    studentTests: studentTestReducer,
  },
});

export default store;