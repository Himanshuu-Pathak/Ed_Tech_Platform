import { combineReducers } from "@reduxjs/toolkit";
import authReducer from "../Slice/authSlice"
import cartReducer from "../Slice/cartSlice";
import courseReducer from "../Slice/courseSlice";
import profileReducer from "../Slice/profileSlice";
import viewCourseReducer from "../Slice/viewCourseSlice";

const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
    course: courseReducer,
    cart: cartReducer,
    ViewCourse: viewCourseReducer,
})

export default rootReducer