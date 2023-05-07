import { combineReducers } from "redux";

// Front
import Layout from "./layout/reducer";

//Dashboard 
import Dashboard from "./dashboard/reducer";

const rootReducer = combineReducers({
  // public
  Layout,
  Dashboard,
});

export default rootReducer;
