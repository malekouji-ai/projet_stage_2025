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
/*eslint-disable*/
import { useState } from "react";
import { NavLink as NavLinkRRD, Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Collapse,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Media,
  NavbarBrand,
  Navbar,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

var ps;

const Sidebar = (props) => {
  const [collapseOpen, setCollapseOpen] = useState();
  const { user } = useAuth();
  const location = useLocation();
  const { sidenavOpen, toggleSidenav } = props;
  
  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // toggles collapse between opened and closed (true/false)
  const toggleCollapse = () => {
    setCollapseOpen((data) => !data);
  };
  // closes the collapse
  const closeCollapse = () => {
    setCollapseOpen(false);
    // Fermer aussi la sidebar sur mobile
    if (toggleSidenav && window.innerWidth < 1200) {
      toggleSidenav();
    }
  };
  // creates the links that appear in the left menu / Sidebar
  const createLinks = (routes) => {
    const userRole = user?.role || "user";
    
    return routes
      .filter((prop) => {
        // Afficher seulement les routes qui doivent être dans la sidebar
        if (!prop.showInSidebar) return false;
        
        // Filtrer par rôle
        if (prop.roles && prop.roles.length > 0) {
          return prop.roles.includes(userRole);
        }
        
        return true;
      })
      .map((prop, key) => {
        return (
          <NavItem key={key}>
            <NavLink
              to={prop.layout + prop.path}
              tag={NavLinkRRD}
              onClick={closeCollapse}
              className={activeRoute(prop.layout + prop.path)}
            >
              <i className={prop.icon} />
              {prop.name}
            </NavLink>
          </NavItem>
        );
      });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <Navbar
      className={`navbar-vertical navbar-modern fixed-left navbar-light bg-white ${sidenavOpen ? 'show' : ''}`}
      expand="md"
      id="sidenav-main"
    >
      <Container fluid>
        {/* Toggler */}
        <button
          className="navbar-toggler navbar-toggler-modern"
          type="button"
          onClick={toggleCollapse}
        >
          <span className="navbar-toggler-icon" />
        </button>
        {/* Brand */}
        {logo ? (
          <NavbarBrand className="pt-0 brand-modern" {...navbarBrandProps}>
            <div className="brand-logo-container">
              <i className="ni ni-calendar-grid-58 brand-icon"></i>
              <span className="brand-text">HKEYITNA</span>
            </div>
          </NavbarBrand>
        ) : null}
        
        {/* User Info Card - Desktop */}
        <div className="user-card d-none d-md-block mt-3 mb-3">
          <div className="user-avatar-container">
            <div className="user-avatar">
              {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
            </div>
          </div>
          <div className="user-info text-center mt-2">
            <h4 className="user-name mb-0">{user?.username || 'Utilisateur'}</h4>
            <span className="user-role badge badge-soft-primary">
              {user?.role || 'USER'}
            </span>
          </div>
        </div>
        
        {/* User - Mobile */}
        <Nav className="align-items-center d-md-none">
          <UncontrolledDropdown nav>
            <DropdownToggle nav>
              <Media className="align-items-center">
                <span className="avatar avatar-sm rounded-circle bg-gradient-primary">
                  <span className="text-white font-weight-bold">
                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </span>
                </span>
              </Media>
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-arrow dropdown-menu-modern" right>
              <DropdownItem className="noti-title" header tag="div">
                <h6 className="text-overflow m-0">Bienvenue {user?.username}!</h6>
              </DropdownItem>
              <DropdownItem to="/admin/user-profile" tag={Link}>
                <i className="ni ni-single-02 text-primary" />
                <span>Mon Profil</span>
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem onClick={() => window.location.href = '/auth/login'}>
                <i className="ni ni-user-run text-danger" />
                <span>Déconnexion</span>
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        {/* Collapse */}
        <Collapse navbar isOpen={collapseOpen}>
          {/* Collapse header */}
          <div className="navbar-collapse-header navbar-collapse-header-modern d-md-none">
            <Row>
              <Col className="collapse-brand" xs="6">
                <div className="brand-logo-container-mobile">
                  <i className="ni ni-calendar-grid-58 brand-icon-mobile"></i>
                  <span className="brand-text-mobile">HKEYITNA</span>
                </div>
              </Col>
              <Col className="collapse-close" xs="6">
                <button
                  className="navbar-toggler navbar-toggler-close"
                  type="button"
                  onClick={toggleCollapse}
                >
                  <i className="ni ni-fat-remove"></i>
                </button>
              </Col>
            </Row>
          </div>
          
          {/* Navigation */}
          <Nav navbar className="nav-modern">{createLinks(routes)}</Nav>
          
          {/* Divider */}
          <hr className="my-3" />
          
          {/* Footer Links - Desktop Only */}
          <div className="sidebar-footer d-none d-md-block">
            <Nav navbar>
              <NavItem>
                <NavLink href="#" className="nav-link-footer">
                  <i className="ni ni-support-16" />
                  <span>Support</span>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="#" className="nav-link-footer">
                  <i className="ni ni-books" />
                  <span>Documentation</span>
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </Collapse>
      </Container>
    </Navbar>
  );
};

Sidebar.defaultProps = {
  routes: [{}],
};

Sidebar.propTypes = {
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
};

export default Sidebar;
