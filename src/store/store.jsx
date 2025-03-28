import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./authSlice";
import teacherTestReducer from "./teacherTestSlice";
import studentTestReducer from "./studentTestSlice";
import submissionReducer from "./submissionSlice";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    teacherTests: teacherTestReducer,
    studentTests: studentTestReducer,
    submissions: submissionReducer,
  },
});

export default store;