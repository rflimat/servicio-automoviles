import React from "react";
import { Navigate, redirect } from "react-router-dom";

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

import Clientes from "../pages/MyPages/Clientes/Index";
import ClientesAdd from "../pages/MyPages/Clientes/Add";
import ClientesEdit from "../pages/MyPages/Clientes/Edit";

import Vehiculos from "../pages/MyPages/Vehiculos/Index";
import VehiculosAdd from "../pages/MyPages/Vehiculos/Add";
import VehiculosEdit from "../pages/MyPages/Vehiculos/Edit";
import VehiculosView from "../pages/MyPages/Vehiculos/View";

import Ventas from "../pages/MyPages/Ventas/Index";
import VentasAdd from "../pages/MyPages/Ventas/Add";
import VentasEdit from "../pages/MyPages/Ventas/Edit";
import VentasView from "../pages/MyPages/Ventas/View";

import Trabajos from "../pages/MyPages/Trabajos/Index";
import TrabajosAdd from "../pages/MyPages/Trabajos/Add";
import TrabajosEdit from "../pages/MyPages/Trabajos/Edit";
import TrabajosView from "../pages/MyPages/Trabajos/View";

import ComprobanteIndex from "../pages/MyPages/Comprobante/Index";

const objUser = JSON.parse(localStorage.getItem("authUser"));

const authProtectedRoutes = [
  // Dashboard
  { path: "/", component: (<></>) },

  // Profile
  { path: "/profile", component: <UserProfile /> },

  // Usuarios
  { path: "/usuarios", component: (objUser && objUser.tipo == "soporte") ? (<Usuarios />) : (<Navigate to='/' />) },
  { path: "/usuarios/add", component: (objUser && objUser.tipo == "soporte") ? (<UsuariosAdd />) : (<Navigate to='/' />) },
  { path: "/usuarios/edit/:id", component: (objUser && objUser.tipo == "soporte") ? (<UsuariosEdit />) : (<Navigate to='/' />) },

  //Productos
  { path: "/productos", component: <Productos /> },
  { path: "/productos/add", component: <ProductosAdd /> },
  { path: "/productos/edit/:id", component: <ProductosEdit /> },
  { path: "/productos/view/:id", component: <ProductosView /> },

  // Proveedores
  { path: "/proveedores", component: <Proveedores /> },
  { path: "/proveedores/add", component: <ProveedoresAdd /> },
  { path: "/proveedores/edit/:id", component: <ProveedoresEdit /> },

  // Compras
  { path: "/compras", component: <Compras /> },
  { path: "/compras/add", component: <ComprasAdd /> },
  { path: "/compras/edit/:id", component: <ComprasEdit /> },
  { path: "/compras/view/:id", component: <ComprasView /> },

  // Clientes
  { path: "/clientes", component: <Clientes /> },
  { path: "/clientes/add", component: <ClientesAdd /> },
  { path: "/clientes/edit/:id", component: <ClientesEdit /> },

  // Vehiculos
  { path: "/vehiculos", component: <Vehiculos /> },
  { path: "/vehiculos/add", component: <VehiculosAdd /> },
  { path: "/vehiculos/edit/:id", component: <VehiculosEdit /> },
  { path: "/vehiculos/view/:id", component: <VehiculosView /> },

  // Ventas
  { path: "/ventas", component: <Ventas /> },
  { path: "/ventas/add", component: <VentasAdd /> },
  { path: "/ventas/edit/:id", component: <VentasEdit /> },
  { path: "/ventas/view/:id", component: <VentasView /> },

  // Trabajos
  { path: "/trabajos", component: <Trabajos /> },
  { path: "/trabajos/add", component: <TrabajosAdd /> },
  { path: "/trabajos/edit/:id", component: <TrabajosEdit /> },
  { path: "/trabajos/view/:id", component: <TrabajosView /> },

  // Comprobante
  { path: "/comprobante/generate", component: <ComprobanteIndex /> },

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
