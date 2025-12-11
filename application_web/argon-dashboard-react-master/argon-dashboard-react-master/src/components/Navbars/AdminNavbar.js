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
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Form,
  FormGroup,
  InputGroupAddon,
  InputGroupText,
  Input,
  InputGroup,
  Navbar,
  Nav,
  Container,
  Media,
} from "reactstrap";

const AdminNavbar = (props) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/auth/login");
  };

  return (
    <>
      <Navbar className="navbar-top navbar-modern navbar-dark" expand="md" id="navbar-main">
        <Container fluid>
          <Link
            className="navbar-brand-text h3 mb-0 text-white text-uppercase d-none d-lg-inline-block"
            to="/"
          >
            {props.brandText}
          </Link>
          <Form className="navbar-search navbar-search-modern form-inline mr-3 d-none d-md-flex ml-lg-auto">
            <FormGroup className="mb-0">
              <InputGroup className="input-group-modern">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="search-icon-modern">
                    <i className="fas fa-search" />
                  </InputGroupText>
                </InputGroupAddon>
                <Input 
                  placeholder="Search" 
                  type="text" 
                  className="search-input-modern"
                />
              </InputGroup>
            </FormGroup>
          </Form>
          <Nav className="align-items-center d-none d-md-flex" navbar>
            <UncontrolledDropdown nav>
              <DropdownToggle className="pr-0 user-dropdown-modern" nav>
                <Media className="align-items-center">
                  <span className="avatar avatar-sm rounded-circle avatar-modern">
                    <span className="avatar-text-modern">
                      {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </span>
                  <Media className="ml-2 d-none d-lg-block">
                    <span className="mb-0 text-sm font-weight-bold text-white">
                      {user?.username || "User"}
                    </span>
                  </Media>
                </Media>
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-arrow dropdown-menu-modern" right>
                <DropdownItem className="noti-title" header tag="div">
                  <h6 className="text-overflow m-0">
                    <i className="ni ni-satisfied mr-2 text-primary"></i>
                    Bienvenue !
                  </h6>
                </DropdownItem>
                <DropdownItem to="/admin/user-profile" tag={Link}>
                  <i className="ni ni-single-02 text-primary" />
                  <span>Mon profil</span>
                </DropdownItem>
                <DropdownItem to="/admin/events" tag={Link}>
                  <i className="ni ni-calendar-grid-58 text-info" />
                  <span>Événements</span>
                </DropdownItem>
                <DropdownItem to="/admin/sync" tag={Link}>
                  <i className="ni ni-settings-gear-65 text-warning" />
                  <span>Synchronisation</span>
                </DropdownItem>
                <DropdownItem divider />
                <DropdownItem onClick={handleLogout} className="text-danger">
                  <i className="ni ni-user-run text-danger" />
                  <span>Déconnexion</span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
};

export default AdminNavbar;
