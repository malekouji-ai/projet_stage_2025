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
import { syncAPI, logsAPI, eventsAPI } from "../../services/api";
import api from "../../services/api";
import {
  Card,
  CardHeader,
  CardBody,
  Container,
  Row,
  Col,
  Button,
  Alert,
  Table,
  Badge,
  CardTitle,
  Progress,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const Sync = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [syncLoading, setSyncLoading] = useState({ push: false, pull: false });
  const [stats, setStats] = useState({
    edtEvents: 0,
    outlookEvents: 0,
    totalLogs: 0,
    lastSync: null,
  });

  useEffect(() => {
    loadLogs();
    loadStats();
    // Actualiser les stats toutes les 30 secondes
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadStats = async () => {
    try {
      const [eventsRes, logsRes] = await Promise.all([
        eventsAPI.getAll(),
        logsAPI.getAll(),
      ]);

      const events = eventsRes.data || [];
      const edtCount = events.filter(e => e.source === 'EDT').length;
      const outlookCount = events.filter(e => e.source === 'OUTLOOK').length;
      
      const allLogs = logsRes.data || [];
      const syncLogs = allLogs.filter(l => l.action?.includes('sync') || l.action?.includes('Push') || l.action?.includes('Pull'));
      const lastSyncLog = syncLogs.length > 0 ? syncLogs[0].createdAt : null;

      setStats({
        edtEvents: edtCount,
        outlookEvents: outlookCount,
        totalLogs: syncLogs.length,
        lastSync: lastSyncLog,
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    }
  };

  const loadLogs = async () => {
    try {
      setLoading(true);
      const response = await logsAPI.getAll();
      setLogs(response.data);
    } catch (err) {
      console.error("Error loading logs:", err);
      setError("Erreur lors du chargement des logs");
    } finally {
      setLoading(false);
    }
  };

  const handlePush = async () => {
    setError("");
    setSuccess("");
    setSyncLoading({ ...syncLoading, push: true });

    try {
      const response = await syncAPI.push();
      setSuccess(response.data || "Synchronisation EDT → Outlook réussie");
      loadLogs();
      loadStats(); // Actualiser les statistiques
    } catch (err) {
      console.error("Error pushing to Outlook:", err);
      setError(err.response?.data || "Erreur lors de la synchronisation vers Outlook");
    } finally {
      setSyncLoading({ ...syncLoading, push: false });
    }
  };

  const handlePull = async () => {
    setError("");
    setSuccess("");
    setSyncLoading({ ...syncLoading, pull: true });

    try {
      const response = await syncAPI.pull();
      setSuccess(response.data || "Synchronisation Outlook → EDT réussie");
      loadLogs();
      loadStats(); // Actualiser les statistiques
    } catch (err) {
      console.error("Error pulling from Outlook:", err);
      setError(err.response?.data || "Erreur lors de la synchronisation depuis Outlook");
    } finally {
      setSyncLoading({ ...syncLoading, pull: false });
    }
  };

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "";
    const date = new Date(dateTimeString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <>
      <Header />
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

        {/* Statistiques de synchronisation */}
        <Row className="mb-4">
          <Col lg="3" xl="3">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                      Événements EDT
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">{stats.edtEvents}</span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                      <i className="fas fa-book" />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" xl="3">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                      Événements Outlook
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">{stats.outlookEvents}</span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                      <i className="fas fa-cloud" />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" xl="3">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                      Logs de Sync
                    </CardTitle>
                    <span className="h2 font-weight-bold mb-0">{stats.totalLogs}</span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-success text-white rounded-circle shadow">
                      <i className="fas fa-list" />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Col lg="3" xl="3">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <CardTitle tag="h5" className="text-uppercase text-muted mb-0">
                      Dernière Sync
                    </CardTitle>
                    <span className="h6 font-weight-bold mb-0">
                      {stats.lastSync ? formatDateTime(stats.lastSync) : "Aucune"}
                    </span>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-danger text-white rounded-circle shadow">
                      <i className="fas fa-clock" />
                    </div>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Cartes de synchronisation */}
        <Row>
          <Col xs="12" className="mb-3">
            <Alert color="info">
              <strong>ℹ️ Mode Démonstration (MOCK)</strong><br />
              La synchronisation avec Outlook est simulée. Les événements ne sont pas réellement envoyés/reçus depuis Microsoft Outlook.
              Cela permet de tester toutes les fonctionnalités sans abonnement Microsoft 365.
            </Alert>
          </Col>
        </Row>

        <Row>
          <Col lg="6" xl="6">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <h5 className="card-title text-uppercase text-muted mb-0">
                      Synchroniser EDT → Outlook
                    </h5>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">
                        Envoyer les événements de l'EDT vers Outlook
                      </span>
                    </p>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-info text-white rounded-circle shadow">
                      <i className="ni ni-send" />
                    </div>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button
                    color="info"
                    onClick={handlePush}
                    disabled={syncLoading.push}
                    block
                  >
                    {syncLoading.push ? (
                      <>
                        <i className="fas fa-spinner fa-spin" /> Synchronisation en cours...
                      </>
                    ) : (
                      <>
                        <i className="ni ni-send" /> Push vers Outlook
                      </>
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>

          <Col lg="6" xl="6">
            <Card className="card-stats mb-4 mb-xl-0">
              <CardBody>
                <Row>
                  <div className="col">
                    <h5 className="card-title text-uppercase text-muted mb-0">
                      Synchroniser Outlook → EDT
                    </h5>
                    <p className="mt-3 mb-0 text-muted text-sm">
                      <span className="text-nowrap">
                        Récupérer les événements depuis Outlook
                      </span>
                    </p>
                  </div>
                  <Col className="col-auto">
                    <div className="icon icon-shape bg-warning text-white rounded-circle shadow">
                      <i className="ni ni-cloud-download-95" />
                    </div>
                  </Col>
                </Row>
                <div className="mt-3">
                  <Button
                    color="warning"
                    onClick={handlePull}
                    disabled={syncLoading.pull}
                    block
                  >
                    {syncLoading.pull ? (
                      <>
                        <i className="fas fa-spinner fa-spin" /> Synchronisation en cours...
                      </>
                    ) : (
                      <>
                        <i className="ni ni-cloud-download-95" /> Pull depuis Outlook
                      </>
                    )}
                  </Button>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Logs d'audit */}
        <Row className="mt-5">
          <div className="col">
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Historique des Synchronisations</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={loadLogs}
                      size="sm"
                      disabled={loading}
                    >
                      <i className="fas fa-sync" /> Actualiser
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Action</th>
                    <th scope="col">Détails</th>
                    <th scope="col">Statut</th>
                    <th scope="col">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Chargement...
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        Aucun log trouvé
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id}>
                        <td data-label="Action">
                          <strong>{log.action}</strong>
                        </td>
                        <td data-label="Détails">{log.details || "-"}</td>
                        <td data-label="Statut">
                          <Badge 
                            color={
                              log.status === "SUCCESS" 
                                ? "success" 
                                : log.status === "FAILED" 
                                ? "danger" 
                                : "warning"
                            }
                          >
                            {log.status}
                          </Badge>
                        </td>
                        <td data-label="Date">{formatDateTime(log.createdAt)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </div>
        </Row>
      </Container>
    </>
  );
};

export default Sync;
