import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./reducer";

import { setToken } from "./Slice/authSlice";
import { setUser } from "./Slice/profileSlice";

const store = configureStore({
  reducer: rootReducer,
});

// ✅ Load token and user from localStorage on app start
const token = JSON.parse(localStorage.getItem("token"));
const user = JSON.parse(localStorage.getItem("user"));

if (token) {
  store.dispatch(setToken(token));
}
if (user) {
  store.dispatch(setUser(user));
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
