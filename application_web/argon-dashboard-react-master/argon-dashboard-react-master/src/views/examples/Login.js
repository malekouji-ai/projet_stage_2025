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

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
  Row,
  Col,
  Alert,
} from "reactstrap";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!username || !password) {
      setError("Veuillez remplir tous les champs");
      setLoading(false);
      return;
    }

    const result = await login(username, password);
    
    if (result.success) {
      navigate("/admin/index");
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <>
      <Col lg="5" md="7">
        <div className="text-center mb-4">
          <div className="mb-4 animate-float">
            <div className="logo-container p-3 rounded-circle bg-white shadow-lg d-inline-block">
              <i className="ni ni-calendar-grid-58 text-primary" style={{ fontSize: '3rem' }}></i>
            </div>
          </div>
          <h1 className="text-white mb-2" style={{ fontWeight: '700', fontSize: '2rem' }}>
            HKEYITNA
          </h1>
          <p className="text-white-50 mb-0">Synchronisation EDT & Outlook</p>
        </div>
        <Card className="auth-card shadow-xl border-0">
          <CardHeader className="auth-header bg-gradient-primary border-0 pb-4">
            <div className="text-center mt-3 mb-2">
              <h3 className="text-white mb-1" style={{ fontWeight: '700' }}>
                <i className="ni ni-key-25 mr-2"></i>Connexion
              </h3>
              <p className="text-white-50 mb-0 small">Accédez à votre espace personnel</p>
            </div>
          </CardHeader>
          <CardBody className="px-lg-5 py-lg-4">
            {error && (
              <Alert color="danger" className="alert-modern">
                <i className="ni ni-fat-remove mr-2"></i>
                <strong>Erreur!</strong> {error}
              </Alert>
            )}
            <Form role="form" onSubmit={handleSubmit}>
              <FormGroup className="mb-3">
                <label className="form-label text-muted small font-weight-bold mb-2">
                  NOM D'UTILISATEUR
                </label>
                <InputGroup className="input-group-alternative input-modern">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-transparent border-right-0">
                      <i className="ni ni-single-02 text-primary" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Entrez votre nom d'utilisateur"
                    type="text"
                    autoComplete="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="border-left-0 pl-0"
                  />
                </InputGroup>
              </FormGroup>
              <FormGroup className="mb-4">
                <label className="form-label text-muted small font-weight-bold mb-2">
                  MOT DE PASSE
                </label>
                <InputGroup className="input-group-alternative input-modern">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText className="bg-transparent border-right-0">
                      <i className="ni ni-lock-circle-open text-primary" />
                    </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    placeholder="Entrez votre mot de passe"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-left-0 pl-0"
                  />
                </InputGroup>
              </FormGroup>
              <div className="text-center">
                <Button 
                  className="btn-modern my-4 px-5 py-3" 
                  color="primary" 
                  type="submit"
                  disabled={loading}
                  block
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <i className="ni ni-curved-next mr-2"></i>
                      Se connecter
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
        <Row className="mt-4">
          <Col className="text-center" xs="12">
            <Link className="text-white hover-link" to="/auth/register">
              <i className="ni ni-bold-right mr-1"></i>
              <span className="font-weight-600">Vous n'avez pas de compte ? Inscrivez-vous</span>
            </Link>
          </Col>
        </Row>
      </Col>
    </>
  );
};

export default Login;
