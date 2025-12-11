/*!

=========================================================
* Argon Dashboard React - v1.2.4
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2024 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Index from "views/Index.js";
import Profile from "views/examples/Profile.js";
import Maps from "views/examples/Maps.js";
import Register from "views/examples/Register.js";
import Login from "views/examples/Login.js";
import Tables from "views/examples/Tables.js";
import Icons from "views/examples/Icons.js";
import Events from "views/examples/Events.js";
import Sync from "views/examples/Sync.js";
import Users from "views/examples/Users.js";

var routes = [
  {
    path: "/index",
    name: "Dashboard",
    icon: "ni ni-tv-2 text-primary",
    component: <Index />,
    layout: "/admin",
    showInSidebar: true,
    roles: ["user", "admin"],
  },
  {
    path: "/events",
    name: "Événements",
    icon: "ni ni-calendar-grid-58 text-blue",
    component: <Events />,
    layout: "/admin",
    showInSidebar: true,
    roles: ["user", "admin"],
  },
  {
    path: "/sync",
    name: "Synchronisation API",
    icon: "ni ni-settings-gear-65 text-orange",
    component: <Sync />,
    layout: "/admin",
    showInSidebar: true,
    roles: ["user", "admin"],
  },
  {
    path: "/users",
    name: "Gestion Utilisateurs",
    icon: "ni ni-single-02 text-red",
    component: <Users />,
    layout: "/admin",
    showInSidebar: true,
    roles: ["admin"],
  },
  {
    path: "/user-profile",
    name: "Mon Profil",
    icon: "ni ni-circle-08 text-yellow",
    component: <Profile />,
    layout: "/admin",
    showInSidebar: true,
    roles: ["user", "admin"],
  },
  {
    path: "/icons",
    name: "Icons",
    icon: "ni ni-planet text-blue",
    component: <Icons />,
    layout: "/admin",
    showInSidebar: false,
    roles: ["user", "admin"],
  },
  {
    path: "/maps",
    name: "Maps",
    icon: "ni ni-pin-3 text-orange",
    component: <Maps />,
    layout: "/admin",
    showInSidebar: false,
    roles: ["user", "admin"],
  },
  {
    path: "/tables",
    name: "Tables",
    icon: "ni ni-bullet-list-67 text-red",
    component: <Tables />,
    layout: "/admin",
    showInSidebar: false,
    roles: ["user", "admin"],
  },
  {
    path: "/login",
    name: "Login",
    icon: "ni ni-key-25 text-info",
    component: <Login />,
    layout: "/auth",
    showInSidebar: false,
    roles: [],
  },
  {
    path: "/register",
    name: "Register",
    icon: "ni ni-circle-08 text-pink",
    component: <Register />,
    layout: "/auth",
    showInSidebar: false,
    roles: [],
  },
];
export default routes;
