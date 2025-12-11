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
import { useNavigate } from "react-router-dom";
import { eventsAPI, logsAPI } from "../services/api";
// node.js library that concatenates classes (strings)
import classnames from "classnames";
// javascipt plugin for creating charts
import Chart from "chart.js";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// reactstrap components
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  Progress,
  Table,
  Container,
  Row,
  Col,
} from "reactstrap";

// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2,
} from "variables/charts.js";

import Header from "components/Headers/Header.js";

const Index = (props) => {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState(1);
  const [events, setEvents] = useState([]);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    edtEvents: 0,
    outlookEvents: 0,
    syncSuccess: 0,
    activeSyncs: 0,
    serverPerformance: 0,
    recentEvents: [],
    recentLogs: [],
    eventsByMonth: [],
  });
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [refreshing, setRefreshing] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    totalEvents: 0,
    edtEvents: 0,
    outlookEvents: 0,
    syncSuccess: 0,
  });

  useEffect(() => {
    loadDashboardData();
    
    // Auto-refresh toutes les 30 secondes
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Animation des compteurs
  useEffect(() => {
    animateCounter('totalEvents', stats.totalEvents);
    animateCounter('edtEvents', stats.edtEvents);
    animateCounter('outlookEvents', stats.outlookEvents);
    animateCounter('syncSuccess', stats.syncSuccess);
  }, [stats]);

  const animateCounter = (key, target) => {
    const duration = 1000;
    const steps = 30;
    const increment = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedStats(prev => ({ ...prev, [key]: Math.floor(current) }));
    }, duration / steps);
  };

  const refreshData = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setLastUpdate(new Date());
    setTimeout(() => setRefreshing(false), 500);
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [eventsResponse, logsResponse] = await Promise.all([
        eventsAPI.getAll(),
        logsAPI.getAll(),
      ]);

      const allEvents = eventsResponse.data;
      const allLogs = logsResponse.data;

      // Calculer les statistiques
      const edtEventsCount = allEvents.filter((e) => e.source === "EDT").length;
      const outlookEventsCount = allEvents.filter(
        (e) => e.source === "OUTLOOK"
      ).length;

      // Événements récents (5 derniers)
      const recentEvents = allEvents
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .slice(0, 5);

      // Logs récents (5 derniers)
      const recentLogs = allLogs
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

      // Événements par mois (pour le graphique)
      const eventsByMonth = calculateEventsByMonth(allEvents);

      // Calculer les métriques de performance
      const successLogs = allLogs.filter(log => log.status === 'SUCCESS').length;
      const syncSuccessRate = allLogs.length > 0 ? Math.round((successLogs / allLogs.length) * 100) : 0;
      
      // Synchronisations actives (logs récents dans les dernières 24h)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const activeSyncsCount = allLogs.filter(log => new Date(log.timestamp) > yesterday).length;
      
      // Performance serveur basée sur le ratio succès/total et la présence d'erreurs récentes
      const recentErrors = allLogs.filter(log => 
        log.status === 'ERROR' && new Date(log.timestamp) > yesterday
      ).length;
      const serverPerf = Math.max(0, syncSuccessRate - (recentErrors * 5));

      setEvents(allEvents);
      setLogs(allLogs);
      setStats({
        totalEvents: allEvents.length,
        edtEvents: edtEventsCount,
        outlookEvents: outlookEventsCount,
        syncSuccess: syncSuccessRate,
        activeSyncs: activeSyncsCount,
        serverPerformance: serverPerf,
        recentEvents,
        recentLogs,
        eventsByMonth,
      });
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateEventsByMonth = (events) => {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const months = {};
    
    // Créer les 8 derniers mois
    const now = new Date();
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months[monthKey] = 0;
    }
    
    // Compter les événements par mois
    events.forEach((event) => {
      const date = new Date(event.startDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (Object.prototype.hasOwnProperty.call(months, monthKey)) {
        months[monthKey]++;
      }
    });

    // Retourner les données formatées
    return Object.keys(months)
      .sort()
      .map((key) => {
        const [year, month] = key.split('-');
        return {
          month: monthNames[parseInt(month) - 1],
          count: months[key],
        };
      });
  };

  const calculateEventsByWeek = (events) => {
    const weeks = {};
    const now = new Date();
    
    // Créer les 8 dernières semaines
    for (let i = 7; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - (i * 7));
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = `S${Math.ceil(date.getDate() / 7)}`;
      weeks[`${weekStart.getTime()}`] = { label: weekKey, count: 0 };
    }
    
    // Compter les événements par semaine
    events.forEach((event) => {
      const date = new Date(event.startDate);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      
      Object.keys(weeks).forEach((key) => {
        const weekTime = parseInt(key);
        const nextWeek = weekTime + (7 * 24 * 60 * 60 * 1000);
        if (date.getTime() >= weekTime && date.getTime() < nextWeek) {
          weeks[key].count++;
        }
      });
    });

    // Retourner les données formatées
    return Object.keys(weeks)
      .sort()
      .map((key) => ({
        month: weeks[key].label,
        count: weeks[key].count,
      }));
  };

  const getChartData = () => {
    // Utiliser les données en fonction de l'onglet actif (1=Month, 2=Week)
    const dataSource = activeNav === 1 ? stats.eventsByMonth : calculateEventsByWeek(events);
    const labels = dataSource.map(m => m.month);
    const data = dataSource.map(m => m.count);
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'Événements',
          data: data,
          borderColor: '#5e72e4',
          backgroundColor: 'rgba(94, 114, 228, 0.1)',
          pointBackgroundColor: '#5e72e4',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#5e72e4',
        },
      ],
    };
  };

  const getChartOptions = () => {
    return {
      scales: {
        yAxes: [
          {
            gridLines: {
              color: '#e9ecef',
              zeroLineColor: '#e9ecef',
            },
            ticks: {
              callback: function (value) {
                return value; // Afficher le nombre sans $
              },
              beginAtZero: true,
            },
          },
        ],
      },
      tooltips: {
        callbacks: {
          label: function (item, data) {
            var label = data.datasets[item.datasetIndex].label || '';
            var yLabel = item.yLabel;
            var content = '';

            if (data.datasets.length > 1) {
              content += label + ': ';
            }

            content += yLabel + ' événement' + (yLabel > 1 ? 's' : '');
            return content;
          },
        },
      },
    };
  };

  const getSyncChartData = () => {
    // Compter les syncs des 6 derniers mois
    const monthNames = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const syncsByMonth = {};
    
    // Initialiser les 6 derniers mois
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = monthNames[date.getMonth() % 12];
      syncsByMonth[monthKey] = 0;
    }
    
    // Compter les logs de sync par mois
    logs.forEach((log) => {
      const date = new Date(log.timestamp);
      const monthKey = monthNames[date.getMonth() % 12];
      if (Object.prototype.hasOwnProperty.call(syncsByMonth, monthKey)) {
        syncsByMonth[monthKey]++;
      }
    });
    
    const labels = Object.keys(syncsByMonth);
    const data = Object.values(syncsByMonth);
    
    return {
      labels: labels,
      datasets: [
        {
          label: 'Synchronisations',
          data: data,
          backgroundColor: '#fb6340',
          maxBarThickness: 10,
        },
      ],
    };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status) => {
    const badges = {
      SUCCESS: { color: "success", text: "Succès" },
      ERROR: { color: "danger", text: "Erreur" },
      PENDING: { color: "warning", text: "En attente" },
    };
    return badges[status] || { color: "secondary", text: status };
  };

  if (window.Chart) {
    parseOptions(Chart, chartOptions());
  }

  const toggleNavs = (e, index) => {
    e.preventDefault();
    setActiveNav(index);
  };
  return (
    <>
      <Header animatedStats={animatedStats} refreshing={refreshing} />
      {/* Page content */}
      <Container className="mt--7" fluid>
        {/* Barre de mise à jour */}
        <Row className="mb-3">
          <Col>
            <div className="d-flex justify-content-between align-items-center dashboard-toolbar">
              <div className="dashboard-update-info">
                <i className={`ni ni-time-alarm mr-2 ${refreshing ? 'text-success spin-animation' : 'text-muted'}`}></i>
                <small className="text-muted">
                  Dernière mise à jour: {lastUpdate.toLocaleTimeString('fr-FR')}
                </small>
              </div>
              <Button 
                color="primary" 
                size="sm" 
                onClick={refreshData}
                disabled={refreshing}
                className="btn-refresh-dashboard"
              >
                <i className={`ni ni-refresh-02 mr-1 ${refreshing ? 'spin-animation' : ''}`}></i>
                {refreshing ? 'Actualisation...' : 'Actualiser'}
              </Button>
            </div>
          </Col>
        </Row>

        <Row>
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="card-chart-dynamic shadow">
              <CardHeader className="bg-transparent">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-light ls-1 mb-1">
                      <i className="ni ni-chart-bar-32 mr-2"></i>
                      Activité
                    </h6>
                    <h2 className="text-white mb-0">Événements mensuels</h2>
                  </div>
                  <div className="col">
                    <Nav className="justify-content-end" pills>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 1,
                          })}
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 1)}
                        >
                          <span className="d-none d-md-block">Month</span>
                          <span className="d-md-none">M</span>
                        </NavLink>
                      </NavItem>
                      <NavItem>
                        <NavLink
                          className={classnames("py-2 px-3", {
                            active: activeNav === 2,
                          })}
                          data-toggle="tab"
                          href="#pablo"
                          onClick={(e) => toggleNavs(e, 2)}
                        >
                          <span className="d-none d-md-block">Week</span>
                          <span className="d-md-none">W</span>
                        </NavLink>
                      </NavItem>
                    </Nav>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  {loading ? (
                    <div className="text-center py-5">
                      <i className="fas fa-spinner fa-spin fa-2x text-muted"></i>
                    </div>
                  ) : (
                    <Line
                      key={`chart-${activeNav}`}
                      data={getChartData()}
                      options={getChartOptions()}
                      getDatasetAtEvent={(e) => console.log(e)}
                    />
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="card-performance-dynamic shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h6 className="text-uppercase text-muted ls-1 mb-1">
                      <i className="ni ni-chart-pie-35 mr-2"></i>
                      Performance
                    </h6>
                    <h2 className="mb-0">Activité de synchronisation</h2>
                  </div>
                </Row>
              </CardHeader>
              <CardBody>
                {/* Chart */}
                <div className="chart">
                  {loading ? (
                    <div className="text-center py-5">
                      <i className="fas fa-spinner fa-spin fa-2x text-muted"></i>
                    </div>
                  ) : (
                    <Bar
                      data={getSyncChartData()}
                      options={chartExample2.options}
                    />
                  )}
                </div>
                
                {/* Indicateurs de performance */}
                <div className="performance-indicators mt-4">
                  <div className="indicator-item">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-sm font-weight-bold">Taux de succès</span>
                      <span className={`font-weight-bold ${stats.syncSuccess >= 80 ? 'text-success' : stats.syncSuccess >= 60 ? 'text-warning' : 'text-danger'}`}>
                        {stats.syncSuccess}%
                      </span>
                    </div>
                    <Progress 
                      value={stats.syncSuccess} 
                      color={stats.syncSuccess >= 80 ? 'success' : stats.syncSuccess >= 60 ? 'warning' : 'danger'} 
                      className="progress-dynamic" 
                    />
                  </div>
                  
                  <div className="indicator-item mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-sm font-weight-bold">Synchronisations (24h)</span>
                      <span className="text-info font-weight-bold">{stats.activeSyncs}</span>
                    </div>
                    <Progress 
                      value={Math.min(100, (stats.activeSyncs / 20) * 100)} 
                      color="info" 
                      className="progress-dynamic" 
                    />
                  </div>
                  
                  <div className="indicator-item mt-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-sm font-weight-bold">Performance serveur</span>
                      <span className={`font-weight-bold ${stats.serverPerformance >= 70 ? 'text-success' : 'text-warning'}`}>
                        {stats.serverPerformance}%
                      </span>
                    </div>
                    <Progress 
                      value={stats.serverPerformance} 
                      color={stats.serverPerformance >= 70 ? 'success' : 'warning'} 
                      className="progress-dynamic" 
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col className="mb-5 mb-xl-0" xl="8">
            <Card className="card-table-dynamic shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <i className="ni ni-calendar-grid-58 text-primary mr-2"></i>
                      Événements Récents
                    </h3>
                    <small className="text-muted">
                      {stats.recentEvents.length} événements affichés
                    </small>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={() => navigate("/admin/events")}
                      size="sm"
                      className="btn-icon-split"
                    >
                      <span>Voir tout</span>
                      <i className="ni ni-bold-right ml-2"></i>
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr data-label="">
                    <th scope="col" data-label="Titre">Titre</th>
                    <th scope="col" data-label="Lieu">Lieu</th>
                    <th scope="col" data-label="Date">Date</th>
                    <th scope="col" data-label="Source">Source</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="text-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Chargement...
                      </td>
                    </tr>
                  ) : stats.recentEvents.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center text-muted">
                        Aucun événement pour le moment
                      </td>
                    </tr>
                  ) : (
                    stats.recentEvents.map((event) => (
                      <tr key={event.id}>
                        <th scope="row" data-label="Titre">{event.title}</th>
                        <td data-label="Lieu">{event.location || "—"}</td>
                        <td data-label="Date">{formatDate(event.startDate)}</td>
                        <td data-label="Source">
                          <span
                            className={`badge badge-${
                              event.source === "EDT" ? "info" : "primary"
                            }`}
                          >
                            {event.source}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
          <Col xl="4">
            <Card className="card-logs-dynamic shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">
                      <i className="ni ni-archive-2 text-info mr-2"></i>
                      Logs de Synchronisation
                    </h3>
                    <small className="text-muted">
                      <span className="pulse-dot"></span>
                      Activité en temps réel
                    </small>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={() => navigate("/admin/sync")}
                      size="sm"
                      className="btn-icon-split"
                    >
                      <span>Voir tout</span>
                      <i className="ni ni-bold-right ml-2"></i>
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr data-label="">
                    <th scope="col" data-label="Action">Action</th>
                    <th scope="col" data-label="Statut">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="2" className="text-center">
                        <i className="fas fa-spinner fa-spin mr-2"></i>
                        Chargement...
                      </td>
                    </tr>
                  ) : stats.recentLogs.length === 0 ? (
                    <tr>
                      <td colSpan="2" className="text-center text-muted">
                        Aucun log pour le moment
                      </td>
                    </tr>
                  ) : (
                    stats.recentLogs.map((log) => {
                      const badge = getStatusBadge(log.status);
                      return (
                        <tr key={log.id}>
                          <th scope="row" data-label="Action">
                            <div className="d-flex flex-column">
                              <span className="mb-0 text-sm">
                                {log.action || log.operation}
                              </span>
                              <small className="text-muted">
                                {formatDate(log.timestamp)}
                              </small>
                            </div>
                          </th>
                          <td data-label="Statut">
                            <span className={`badge badge-${badge.color}`}>
                              {badge.text}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Index;
