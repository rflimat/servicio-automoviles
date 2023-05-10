import axios from "axios";
import { del, get, post, put } from "./api_helper";

// Gets the logged in user data from local session
/*const getLoggedInUser = () => {
  const user = localStorage.getItem("user");
  if (user) return JSON.parse(user);
  return null;
};

//is user is logged in
const isUserAuthenticated = () => {
  return getLoggedInUser() !== null;
};*/

// Login Method
const postJwtLogin = data => post("http://127.0.0.1:8000/api/login", data);

// Login Method
const postJwtLogout = data => post("http://127.0.0.1:8000/api/logout", data);

// get dashboard charts data
export const getWeeklyData = () => get("/weekly-data");
export const getYearlyData = () => get("/yearly-data");
export const getMonthlyData = () => get("/monthly-data");

export {
  postJwtLogin,
  postJwtLogout,
};
