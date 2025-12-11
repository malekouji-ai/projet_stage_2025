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
import React from "react";
import { useLocation, Route, Routes, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// reactstrap components
import { Container } from "reactstrap";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import routes from "routes.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [sidenavOpen, setSidenavOpen] = React.useState(false);

  // Rediriger vers login si non authentifié
  if (!isAuthenticated()) {
    return <Navigate to="/auth/login" replace />;
  }

  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const toggleSidenav = () => {
    setSidenavOpen(!sidenavOpen);
    // Empêcher le scroll du body quand la sidebar est ouverte sur mobile
    if (!sidenavOpen && window.innerWidth < 1200) {
      document.body.classList.add('sidenav-open');
    } else {
      document.body.classList.remove('sidenav-open');
    }
  };

  const closeSidenav = () => {
    setSidenavOpen(false);
    document.body.classList.remove('sidenav-open');
  };
  
  // Fermer la sidebar au changement de route
  React.useEffect(() => {
    closeSidenav();
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      {/* Bouton hamburger pour mobile/tablet */}
      <button
        className="sidenav-toggler d-lg-none"
        onClick={toggleSidenav}
        style={{
          display: window.innerWidth >= 1200 ? 'none' : 'block'
        }}
      >
        <i className="fas fa-bars"></i>
      </button>
      
      {/* Overlay pour fermer la sidebar sur mobile */}
      <div 
        className={`sidenav-overlay ${sidenavOpen ? 'show' : ''}`}
        onClick={closeSidenav}
      ></div>
      
      {/* Sidebar avec classe show conditionnelle */}
      <div className={sidenavOpen ? 'show' : ''}>
        <Sidebar
          {...props}
          routes={routes}
          logo={{
            innerLink: "/admin/index",
            imgSrc: require("../assets/img/brand/hkeyitna-logo.svg").default,
            imgAlt: "HKEYITNA",
          }}
          toggleSidenav={toggleSidenav}
          sidenavOpen={sidenavOpen}
        />
      </div>
      
      <div className="main-content" ref={mainContent}>
        <AdminNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
          toggleSidenav={toggleSidenav}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/admin/index" replace />} />
        </Routes>
        <Container fluid>
          <AdminFooter />
        </Container>
      </div>
    </>
  );
};

export default Admin;
