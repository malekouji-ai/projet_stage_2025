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

// reactstrap components
import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <footer className="footer footer-modern">
      <Row className="align-items-center justify-content-between">
        <Col lg="6" className="mb-3 mb-lg-0">
          <div className="copyright text-center text-lg-left">
            <i className="ni ni-favourite-28 text-primary mr-1"></i>
            <span className="copyright-text">
              © {new Date().getFullYear()} <strong>HKEYITNA</strong> - Synchronisation EDT & Outlook
            </span>
          </div>
        </Col>

        <Col lg="6">
          <Nav className="nav-footer-modern justify-content-center justify-content-lg-end">
            <NavItem>
              <NavLink href="#" className="footer-link-modern">
                <i className="ni ni-support-16 mr-1"></i>
                Support
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#" className="footer-link-modern">
                <i className="ni ni-single-copy-04 mr-1"></i>
                Documentation
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#" className="footer-link-modern">
                <i className="ni ni-books mr-1"></i>
                À propos
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#" className="footer-link-modern">
                <i className="ni ni-email-83 mr-1"></i>
                Contact
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    </footer>
  );
};

export default Footer;
