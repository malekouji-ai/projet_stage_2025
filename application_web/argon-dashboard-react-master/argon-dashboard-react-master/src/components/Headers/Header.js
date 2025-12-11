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

import { useState, useEffect } from "react";
// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { eventsAPI, logsAPI } from "../../services/api";
import api from "../../services/api";

const Header = ({ animatedStats, refreshing }) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    edtEvents: 0,
    outlookEvents: 0,
    syncSuccess: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  // Utiliser les stats animées si disponibles
  const displayStats = animatedStats || stats;

  const loadStats = async () => {
    try {
      const [eventsRes, logsRes] = await Promise.all([
        eventsAPI.getAll(),
        logsAPI.getAll(),
      ]);

      const events = eventsRes.data || [];
      const logs = logsRes.data || [];
      
      const edtCount = events.filter(e => e.source === 'EDT').length;
      const outlookCount = events.filter(e => e.source === 'OUTLOOK').length;
      
      // Calculer le taux de succès des synchronisations
      const successLogs = logs.filter(log => log.status === 'SUCCESS').length;
      const syncSuccessRate = logs.length > 0 ? Math.round((successLogs / logs.length) * 100) : 0;

      setStats({
        totalEvents: events.length,
        edtEvents: edtCount,
        outlookEvents: outlookCount,
        syncSuccess: syncSuccessRate,
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  return (
    <>
      <div className={`header header-modern bg-gradient-modern pb-8 pt-5 pt-md-8 ${refreshing ? 'refreshing-header' : ''}`}>
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <Card className="card-stats-modern mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="card-title-modern text-uppercase text-muted mb-0"
                        >
                          Total Événements
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0 stat-number">
                          {displayStats.totalEvents}
                        </span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon-shape-modern icon-shape-red">
                          <i className="ni ni-archive-2" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm stat-description">
                      <span className="text-nowrap">Nombre total d'événements</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats-modern mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="card-title-modern text-uppercase text-muted mb-0"
                        >
                          Outlook
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0 stat-number">{displayStats.outlookEvents}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon-shape-modern icon-shape-orange">
                          <i className="ni ni-world" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm stat-description">
                      <span className="text-nowrap">Événements Outlook</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats-modern mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="card-title-modern text-uppercase text-muted mb-0"
                        >
                          Événements EDT
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0 stat-number">{displayStats.edtEvents}</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon-shape-modern icon-shape-yellow">
                          <i className="ni ni-books" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm stat-description">
                      <span className="text-nowrap">Source EDT uniquement</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats-modern mb-4 mb-xl-0">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="card-title-modern text-uppercase text-muted mb-0"
                        >
                          Taux de Succès
                        </CardTitle>
                        <span className="h2 font-weight-bold mb-0 stat-number">{displayStats.syncSuccess}%</span>
                      </div>
                      <Col className="col-auto">
                        <div className="icon-shape-modern icon-shape-green">
                          <i className="ni ni-check-bold" />
                        </div>
                      </Col>
                    </Row>
                    <p className="mt-3 mb-0 text-muted text-sm stat-description">
                      <span className="text-nowrap">Synchronisations réussies</span>
                    </p>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
