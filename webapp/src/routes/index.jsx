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

import Usuarios from "../pages/MyPages/Usuarios/Index";
import UsuariosAdd from "../pages/MyPages/Usuarios/Add";
import UsuariosEdit from "../pages/MyPages/Usuarios/Edit";

import Proveedores from "../pages/MyPages/Proveedores/Index";
import ProveedoresAdd from "../pages/MyPages/Proveedores/Add";
import ProveedoresEdit from "../pages/MyPages/Proveedores/Edit";

import Productos from "../pages/MyPages/Productos/Index";
import ProductosAdd from "../pages/MyPages/Productos/Add";
import ProductosEdit from "../pages/MyPages/Productos/Edit";
import ProductosView from "../pages/MyPages/Productos/View";

import Compras from "../pages/MyPages/Compras/Index";
import ComprasAdd from "../pages/MyPages/Compras/Add";
import ComprasEdit from "../pages/MyPages/Compras/Edit";
import ComprasView from "../pages/MyPages/Compras/View";

const authProtectedRoutes = [
  // Dashboard
  { path: "/dashboard", component: <Dashboard /> },,

  // Profile
  { path: "/profile", component: <UserProfile /> },

  // Usuarios
  { path: "/usuarios", component: <Usuarios /> },
  { path: "/usuarios/add", component: <UsuariosAdd /> },
  { path: "/usuarios/edit/:id", component: <UsuariosEdit /> },
  
  //Productos
  { path: "/productos", component: <Productos /> },
  { path: "/productos/add", component: <ProductosAdd /> },
  { path: "/productos/edit/:id", component: <ProductosEdit /> },
  { path: "/productos/view/:id", component: <ProductosView /> },

  // Proveedores
  { path: "/proveedores", component: <Proveedores/> },
  { path: "/proveedores/add", component: <ProveedoresAdd/> },
  { path: "/proveedores/edit/:id", component: <ProveedoresEdit/> },

  // Compras
  { path: "/compras", component: <Compras/> },
  { path: "/compras/add", component: <ComprasAdd/> },
  { path: "/compras/edit/:id", component: <ComprasEdit/> },
  { path: "/compras/view/:id", component: <ComprasView /> },

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
