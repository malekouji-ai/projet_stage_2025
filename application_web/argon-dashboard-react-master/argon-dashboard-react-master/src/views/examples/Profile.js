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

import React, { useState, useEffect } from "react";
import { useAuth } from "contexts/AuthContext";
import { eventsAPI, logsAPI } from "services/api";
import api from "services/api";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  Badge,
} from "reactstrap";
// core components
import UserHeader from "components/Headers/UserHeader.js";

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    username: user?.username || "",
    email: "",
    firstName: "",
    lastName: "",
    bio: "",
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [stats, setStats] = useState({
    totalEvents: 0,
    edtEvents: 0,
    outlookEvents: 0,
    totalSyncs: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    loadProfileData();
    loadStats();
  }, []);

  const loadProfileData = async () => {
    try {
      // Charger les données du profil depuis le backend
      const response = await api.get('/user/profile');
      setProfileData({
        username: response.data.username || user?.username || "",
        email: response.data.email || "",
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        bio: response.data.bio || "",
      });
    } catch (err) {
      console.log('Using default profile data');
      setProfileData({
        username: user?.username || "",
        email: user?.username ? `${user.username}@hkeyitna.com` : "",
        firstName: "",
        lastName: "",
        bio: "",
      });
    }
  };

  const loadStats = async () => {
    try {
      const [eventsRes, logsRes] = await Promise.all([
        eventsAPI.getAll(),
        logsAPI.getAll(),
      ]);

      const events = eventsRes.data || [];
      const edtCount = events.filter(e => e.source === 'EDT').length;
      const outlookCount = events.filter(e => e.source === 'OUTLOOK').length;
      const logs = logsRes.data || [];
      const syncCount = logs.filter(l => l.action?.includes('sync') || l.action?.includes('Push') || l.action?.includes('Pull')).length;

      setStats({
        totalEvents: events.length,
        edtEvents: edtCount,
        outlookEvents: outlookCount,
        totalSyncs: syncCount,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await api.put('/user/profile', profileData);
      setSuccess("Profil mis à jour avec succès!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    try {
      await api.put('/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess("Mot de passe modifié avec succès!");
      setPasswordModalOpen(false);
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors du changement de mot de passe");
    }
  };

  return (
    <>
      <UserHeader />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {error && (
          <Alert color="danger" toggle={() => setError("")}>
            <strong>Erreur!</strong> {error}
          </Alert>
        )}
        {success && (
          <Alert color="success" toggle={() => setSuccess("")}>
            <strong>Succès!</strong> {success}
          </Alert>
        )}
        
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <Row className="justify-content-center">
                <Col className="order-lg-2" lg="3">
                  <div className="card-profile-image">
                    <a href="#pablo" onClick={(e) => e.preventDefault()}>
                      <div className="avatar-placeholder rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center" style={{width: '180px', height: '180px', margin: '0 auto'}}>
                        <span className="text-white" style={{fontSize: '64px', fontWeight: 'bold'}}>
                          {profileData.username ? profileData.username.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                    </a>
                  </div>
                </Col>
              </Row>
              <CardHeader className="text-center border-0 pt-8 pt-md-4 pb-0 pb-md-4">
                <div className="d-flex justify-content-center">
                  <Badge color="info" className="badge-lg">
                    {user?.role || 'USER'}
                  </Badge>
                </div>
              </CardHeader>
              <CardBody className="pt-0 pt-md-4">
                <Row>
                  <div className="col">
                    <div className="card-profile-stats d-flex justify-content-center mt-md-5">
                      <div>
                        <span className="heading">{stats.totalEvents}</span>
                        <span className="description">Événements</span>
                      </div>
                      <div>
                        <span className="heading">{stats.edtEvents}</span>
                        <span className="description">EDT</span>
                      </div>
                      <div>
                        <span className="heading">{stats.outlookEvents}</span>
                        <span className="description">Outlook</span>
                      </div>
                      <div>
                        <span className="heading">{stats.totalSyncs}</span>
                        <span className="description">Syncs</span>
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="text-center">
                  <h3 className="mt-4">
                    {profileData.firstName || profileData.lastName 
                      ? `${profileData.firstName} ${profileData.lastName}` 
                      : profileData.username}
                  </h3>
                  <div className="h5 font-weight-300">
                    <i className="ni ni-email-83 mr-2" />
                    {profileData.email || 'Non renseigné'}
                  </div>
                  <div className="h5 mt-4">
                    <i className="ni ni-badge mr-2" />
                    Membre depuis {new Date().toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </div>
                  <hr className="my-4" />
                  {profileData.bio ? (
                    <p className="text-muted">{profileData.bio}</p>
                  ) : (
                    <p className="text-muted font-italic">Aucune biographie renseignée</p>
                  )}
                  <Button
                    color="primary"
                    onClick={() => setPasswordModalOpen(true)}
                    size="sm"
                    className="mt-3"
                  >
                    <i className="ni ni-lock-circle-open mr-2" />
                    Changer le mot de passe
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-secondary shadow">
              <CardHeader className="bg-white border-0">
                <Row className="align-items-center">
                  <Col xs="8">
                    <h3 className="mb-0"><i className="ni ni-single-02 mr-2" />Mon Compte</h3>
                  </Col>
                  <Col className="text-right" xs="4">
                    <Button
                      color="primary"
                      onClick={handleProfileSubmit}
                      size="sm"
                      disabled={loading}
                    >
                      {loading ? (
                        <><i className="fas fa-spinner fa-spin" /> Enregistrement...</>
                      ) : (
                        <><i className="ni ni-check-bold" /> Enregistrer</>
                      )}
                    </Button>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <Form onSubmit={handleProfileSubmit}>
                  <h6 className="heading-small text-muted mb-4">
                    <i className="ni ni-badge mr-2" />Informations utilisateur
                  </h6>
                  <div className="pl-lg-4">
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-username"
                          >
                            Nom d'utilisateur
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profileData.username}
                            id="input-username"
                            placeholder="Nom d'utilisateur"
                            type="text"
                            name="username"
                            onChange={handleProfileChange}
                            disabled
                          />
                          <small className="text-muted">Le nom d'utilisateur ne peut pas être modifié</small>
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-email"
                          >
                            Adresse e-mail
                          </label>
                          <Input
                            className="form-control-alternative"
                            id="input-email"
                            placeholder="utilisateur@exemple.com"
                            type="email"
                            name="email"
                            value={profileData.email}
                            onChange={handleProfileChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-first-name"
                          >
                            Prénom
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profileData.firstName}
                            id="input-first-name"
                            placeholder="Prénom"
                            type="text"
                            name="firstName"
                            onChange={handleProfileChange}
                          />
                        </FormGroup>
                      </Col>
                      <Col lg="6">
                        <FormGroup>
                          <label
                            className="form-control-label"
                            htmlFor="input-last-name"
                          >
                            Nom
                          </label>
                          <Input
                            className="form-control-alternative"
                            value={profileData.lastName}
                            id="input-last-name"
                            placeholder="Nom"
                            type="text"
                            name="lastName"
                            onChange={handleProfileChange}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr className="my-4" />
                  <h6 className="heading-small text-muted mb-4">
                    <i className="ni ni-align-left-2 mr-2" />À propos de moi
                  </h6>
                  <div className="pl-lg-4">
                    <FormGroup>
                      <label className="form-control-label">Biographie</label>
                      <Input
                        className="form-control-alternative"
                        placeholder="Quelques mots sur vous..."
                        rows="4"
                        value={profileData.bio}
                        type="textarea"
                        name="bio"
                        onChange={handleProfileChange}
                      />
                    </FormGroup>
                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Modal pour changer le mot de passe */}
        <Modal isOpen={passwordModalOpen} toggle={() => setPasswordModalOpen(false)}>
          <ModalHeader toggle={() => setPasswordModalOpen(false)}>
            <i className="ni ni-lock-circle-open mr-2" />
            Changer le mot de passe
          </ModalHeader>
          <Form onSubmit={handlePasswordSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="currentPassword">Mot de passe actuel *</Label>
                <Input
                  type="password"
                  name="currentPassword"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Entrez votre mot de passe actuel"
                />
              </FormGroup>
              <FormGroup>
                <Label for="newPassword">Nouveau mot de passe *</Label>
                <Input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Minimum 6 caractères"
                />
              </FormGroup>
              <FormGroup>
                <Label for="confirmPassword">Confirmer le mot de passe *</Label>
                <Input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  placeholder="Confirmez votre nouveau mot de passe"
                />
              </FormGroup>
              {passwordData.newPassword && passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                <Alert color="warning">
                  Les mots de passe ne correspondent pas
                </Alert>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={() => setPasswordModalOpen(false)}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                <i className="ni ni-check-bold mr-2" />
                Changer le mot de passe
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default Profile;
