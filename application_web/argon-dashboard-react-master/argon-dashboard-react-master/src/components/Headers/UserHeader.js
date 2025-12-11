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

// reactstrap components
import { Container } from "reactstrap";
import { useAuth } from "../../contexts/AuthContext";

const UserHeader = () => {
  const { user } = useAuth();
  
  return (
    <>
      <div
        className="header pb-8 pt-5 pt-lg-8 d-flex align-items-center user-header-modern"
        style={{
          minHeight: "400px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
        }}
      >
        {/* Header container */}
        <Container className="d-flex align-items-center" fluid>
          <div className="user-header-content">
            <div className="user-header-avatar">
              <div className="avatar-circle-large">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
            <h1 className="display-3 text-white mb-2">
              {user?.username || 'Utilisateur'}
            </h1>
            <p className="text-white-50 mb-0">
              <i className="ni ni-email-83 mr-2"></i>
              {user?.email || ''}
            </p>
          </div>
        </Container>
      </div>
    </>
  );
};

export default UserHeader;
