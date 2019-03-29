import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

import App from "./App";
import { BrowserRouter } from "react-router-dom";
import registerServiceWorker from "./registerServiceWorker";
import { combineReducers, createStore } from "redux";
//import { Provider } from "react-redux";
import productReducer from "./reducers/ProductReducer";
import userReducer from "./reducers/user-reducer";
//import Insights from "../src/Insights/Insights-components";

const allReducers = combineReducers({
  product: productReducer,
  user: userReducer
});

const store = createStore(
  allReducers,
  {
    product: [{ name: "iphone" }],
    user: "michel"
  },
  window.devToolsExtension && window.devToolsExtension()
);
global.store = store;
// add actions

// now dispatch action

console.log("store.getStore()", store.getState());
{
}
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);
registerServiceWorker();
