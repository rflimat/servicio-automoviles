import React from "react";
import { Navigate } from "react-router-dom";

// // Profile
import UserProfile from "../pages/Authentication/user-profile";

// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";

// // Pages
import PagesMaintenance from "../pages/Utility/pages-maintenance";
import PagesComingsoon from "../pages/Utility/pages-comingsoon";
import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import Add from "../pages/MyPages/Usuarios/Add";
import Index from "../pages/MyPages/Usuarios/Index";
import Edit from "../pages/MyPages/Usuarios/Edit";

const authProtectedRoutes = [
  // Dashboard
  { path: "/dashboard", component: <Dashboard /> },,

  // Profile
  { path: "/profile", component: <UserProfile /> },

  // Usuarios
  { path: "/usuarios", component: <Index /> },
  { path: "/usuarios/add", component: <Add /> },
  { path: "/usuarios/edit/:id", component: <Edit /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },

  { path: "/pages-maintenance", component: <PagesMaintenance /> },
  { path: "/pages-comingsoon", component: <PagesComingsoon /> },
  { path: "/pages-404", component: <Pages404 /> },
  { path: "/pages-500", component: <Pages500 /> },
];

export { authProtectedRoutes, publicRoutes };
