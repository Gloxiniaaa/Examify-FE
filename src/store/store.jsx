import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer from "./authSlice";
import teacherTestReducer from "./teacherTestSlice";
import studentTestReducer from "./studentTestSlice";
import submissionReducer from "./submissionSlice";
import userReducer from "./userSlice";

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
    teacherTests: teacherTestReducer,
    studentTests: studentTestReducer,
    submissions: submissionReducer,
    user: userReducer,
  },
});

export default store;