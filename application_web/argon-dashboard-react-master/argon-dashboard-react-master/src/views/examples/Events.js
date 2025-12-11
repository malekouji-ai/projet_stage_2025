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
import { eventsAPI } from "../../services/api";
import {
  Badge,
  Card,
  CardHeader,
  CardFooter,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Table,
  Container,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Alert,
} from "reactstrap";
import Header from "components/Headers/Header.js";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startAt: "",
    endAt: "",
    location: "",
    source: "EDT",
  });

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll();
      setEvents(response.data);
      setError("");
    } catch (err) {
      console.error("Error loading events:", err);
      setError("Erreur lors du chargement des événements");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      // Convertir les dates au format ISO 8601 avec timezone
      const formDataToSend = {
        ...formData,
        startAt: formData.startAt ? new Date(formData.startAt).toISOString() : null,
        endAt: formData.endAt ? new Date(formData.endAt).toISOString() : null,
      };

      if (editingEvent) {
        await eventsAPI.update(editingEvent.id, formDataToSend);
        setSuccess("Événement modifié avec succès");
      } else {
        await eventsAPI.create(formDataToSend);
        setSuccess("Événement créé avec succès");
      }
      
      toggleModal();
      loadEvents();
      
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error saving event:", err);
      setError(err.response?.data?.message || "Erreur lors de la sauvegarde");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
      try {
        await eventsAPI.delete(id);
        setSuccess("Événement supprimé avec succès");
        loadEvents();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Error deleting event:", err);
        setError("Erreur lors de la suppression");
      }
    }
  };

  const toggleModal = () => {
    setModalOpen(!modalOpen);
    if (modalOpen) {
      setEditingEvent(null);
      setFormData({
        title: "",
        description: "",
        startAt: "",
        endAt: "",
        location: "",
        source: "EDT",
      });
    }
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || "",
      description: event.description || "",
      startAt: event.startAt ? event.startAt.substring(0, 16) : "",
      endAt: event.endAt ? event.endAt.substring(0, 16) : "",
      location: event.location || "",
      source: event.source || "EDT",
    });
    setModalOpen(true);
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
    });
  };

  return (
    <>
      <Header />
      <Container className="mt--7" fluid>
        <Row>
          <div className="col">
            {error && (
              <Alert color="danger" toggle={() => setError("")}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert color="success" toggle={() => setSuccess("")}>
                {success}
              </Alert>
            )}
            
            <Card className="shadow">
              <CardHeader className="border-0">
                <Row className="align-items-center">
                  <div className="col">
                    <h3 className="mb-0">Gestion des Événements</h3>
                  </div>
                  <div className="col text-right">
                    <Button
                      color="primary"
                      onClick={toggleModal}
                      size="sm"
                    >
                      <i className="ni ni-fat-add" /> Nouvel événement
                    </Button>
                  </div>
                </Row>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">Titre</th>
                    <th scope="col">Description</th>
                    <th scope="col">Début</th>
                    <th scope="col">Fin</th>
                    <th scope="col">Lieu</th>
                    <th scope="col">Source</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Chargement...
                      </td>
                    </tr>
                  ) : events.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center">
                        Aucun événement trouvé
                      </td>
                    </tr>
                  ) : (
                    events.map((event) => (
                      <tr key={event.id}>
                        <th scope="row" data-label="Titre">{event.title}</th>
                        <td data-label="Description">{event.description || "-"}</td>
                        <td data-label="Début">{formatDateTime(event.startAt)}</td>
                        <td data-label="Fin">{formatDateTime(event.endAt)}</td>
                        <td data-label="Lieu">{event.location || "-"}</td>
                        <td data-label="Source">
                          <Badge color="" className="badge-dot mr-4">
                            <i className={event.source === "EDT" ? "bg-success" : "bg-info"} />
                            {event.source}
                          </Badge>
                        </td>
                        <td className="text-right" data-label="Actions">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#pablo"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem
                                onClick={() => openEditModal(event)}
                              >
                                Modifier
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleDelete(event.id)}
                              >
                                Supprimer
                              </DropdownItem>
                            </DropdownMenu>
                          </UncontrolledDropdown>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
              <CardFooter className="py-4">
                <div className="text-center">
                  <small className="text-muted">
                    Total: {events.length} événement(s)
                  </small>
                </div>
              </CardFooter>
            </Card>
          </div>
        </Row>

        {/* Modal pour créer/modifier un événement */}
        <Modal isOpen={modalOpen} toggle={toggleModal}>
          <ModalHeader toggle={toggleModal}>
            {editingEvent ? "Modifier l'événement" : "Nouvel événement"}
          </ModalHeader>
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <FormGroup>
                <Label for="title">Titre *</Label>
                <Input
                  type="text"
                  name="title"
                  id="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="description">Description</Label>
                <Input
                  type="textarea"
                  name="description"
                  id="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                />
              </FormGroup>
              <FormGroup>
                <Label for="startAt">Date/heure de début *</Label>
                <Input
                  type="datetime-local"
                  name="startAt"
                  id="startAt"
                  value={formData.startAt}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="endAt">Date/heure de fin *</Label>
                <Input
                  type="datetime-local"
                  name="endAt"
                  id="endAt"
                  value={formData.endAt}
                  onChange={handleChange}
                  required
                />
              </FormGroup>
              <FormGroup>
                <Label for="location">Lieu (Pays)</Label>
                <Input
                  type="select"
                  name="location"
                  id="location"
                  value={formData.location}
                  onChange={handleChange}
                >
                  <option value="">Sélectionner un pays</option>
                  <option value="Afghanistan">Afghanistan</option>
                  <option value="Afrique du Sud">Afrique du Sud</option>
                  <option value="Albanie">Albanie</option>
                  <option value="Algérie">Algérie</option>
                  <option value="Allemagne">Allemagne</option>
                  <option value="Andorre">Andorre</option>
                  <option value="Angola">Angola</option>
                  <option value="Arabie Saoudite">Arabie Saoudite</option>
                  <option value="Argentine">Argentine</option>
                  <option value="Arménie">Arménie</option>
                  <option value="Australie">Australie</option>
                  <option value="Autriche">Autriche</option>
                  <option value="Azerbaïdjan">Azerbaïdjan</option>
                  <option value="Bahreïn">Bahreïn</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="Belgique">Belgique</option>
                  <option value="Bénin">Bénin</option>
                  <option value="Biélorussie">Biélorussie</option>
                  <option value="Bolivie">Bolivie</option>
                  <option value="Bosnie-Herzégovine">Bosnie-Herzégovine</option>
                  <option value="Brésil">Brésil</option>
                  <option value="Bulgarie">Bulgarie</option>
                  <option value="Burkina Faso">Burkina Faso</option>
                  <option value="Cameroun">Cameroun</option>
                  <option value="Canada">Canada</option>
                  <option value="Chili">Chili</option>
                  <option value="Chine">Chine</option>
                  <option value="Chypre">Chypre</option>
                  <option value="Colombie">Colombie</option>
                  <option value="Corée du Sud">Corée du Sud</option>
                  <option value="Costa Rica">Costa Rica</option>
                  <option value="Côte d'Ivoire">Côte d'Ivoire</option>
                  <option value="Croatie">Croatie</option>
                  <option value="Cuba">Cuba</option>
                  <option value="Danemark">Danemark</option>
                  <option value="Égypte">Égypte</option>
                  <option value="Émirats Arabes Unis">Émirats Arabes Unis</option>
                  <option value="Équateur">Équateur</option>
                  <option value="Espagne">Espagne</option>
                  <option value="Estonie">Estonie</option>
                  <option value="États-Unis">États-Unis</option>
                  <option value="Éthiopie">Éthiopie</option>
                  <option value="Finlande">Finlande</option>
                  <option value="France">France</option>
                  <option value="Gabon">Gabon</option>
                  <option value="Géorgie">Géorgie</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Grèce">Grèce</option>
                  <option value="Guatemala">Guatemala</option>
                  <option value="Guinée">Guinée</option>
                  <option value="Haïti">Haïti</option>
                  <option value="Honduras">Honduras</option>
                  <option value="Hongrie">Hongrie</option>
                  <option value="Inde">Inde</option>
                  <option value="Indonésie">Indonésie</option>
                  <option value="Irak">Irak</option>
                  <option value="Iran">Iran</option>
                  <option value="Irlande">Irlande</option>
                  <option value="Islande">Islande</option>
                  <option value="Israël">Israël</option>
                  <option value="Italie">Italie</option>
                  <option value="Jamaïque">Jamaïque</option>
                  <option value="Japon">Japon</option>
                  <option value="Jordanie">Jordanie</option>
                  <option value="Kazakhstan">Kazakhstan</option>
                  <option value="Kenya">Kenya</option>
                  <option value="Koweït">Koweït</option>
                  <option value="Lettonie">Lettonie</option>
                  <option value="Liban">Liban</option>
                  <option value="Libye">Libye</option>
                  <option value="Lituanie">Lituanie</option>
                  <option value="Luxembourg">Luxembourg</option>
                  <option value="Macédoine du Nord">Macédoine du Nord</option>
                  <option value="Madagascar">Madagascar</option>
                  <option value="Malaisie">Malaisie</option>
                  <option value="Mali">Mali</option>
                  <option value="Malte">Malte</option>
                  <option value="Maroc">Maroc</option>
                  <option value="Maurice">Maurice</option>
                  <option value="Mauritanie">Mauritanie</option>
                  <option value="Mexique">Mexique</option>
                  <option value="Moldavie">Moldavie</option>
                  <option value="Monaco">Monaco</option>
                  <option value="Mongolie">Mongolie</option>
                  <option value="Monténégro">Monténégro</option>
                  <option value="Mozambique">Mozambique</option>
                  <option value="Namibie">Namibie</option>
                  <option value="Népal">Népal</option>
                  <option value="Nicaragua">Nicaragua</option>
                  <option value="Niger">Niger</option>
                  <option value="Nigéria">Nigéria</option>
                  <option value="Norvège">Norvège</option>
                  <option value="Nouvelle-Zélande">Nouvelle-Zélande</option>
                  <option value="Oman">Oman</option>
                  <option value="Pakistan">Pakistan</option>
                  <option value="Palestine">Palestine</option>
                  <option value="Panama">Panama</option>
                  <option value="Paraguay">Paraguay</option>
                  <option value="Pays-Bas">Pays-Bas</option>
                  <option value="Pérou">Pérou</option>
                  <option value="Philippines">Philippines</option>
                  <option value="Pologne">Pologne</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Qatar">Qatar</option>
                  <option value="République Démocratique du Congo">République Démocratique du Congo</option>
                  <option value="République Dominicaine">République Dominicaine</option>
                  <option value="République Tchèque">République Tchèque</option>
                  <option value="Roumanie">Roumanie</option>
                  <option value="Royaume-Uni">Royaume-Uni</option>
                  <option value="Russie">Russie</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Salvador">Salvador</option>
                  <option value="Sénégal">Sénégal</option>
                  <option value="Serbie">Serbie</option>
                  <option value="Singapour">Singapour</option>
                  <option value="Slovaquie">Slovaquie</option>
                  <option value="Slovénie">Slovénie</option>
                  <option value="Somalie">Somalie</option>
                  <option value="Soudan">Soudan</option>
                  <option value="Sri Lanka">Sri Lanka</option>
                  <option value="Suède">Suède</option>
                  <option value="Suisse">Suisse</option>
                  <option value="Syrie">Syrie</option>
                  <option value="Taïwan">Taïwan</option>
                  <option value="Tanzanie">Tanzanie</option>
                  <option value="Tchad">Tchad</option>
                  <option value="Thaïlande">Thaïlande</option>
                  <option value="Togo">Togo</option>
                  <option value="Tunisie">Tunisie</option>
                  <option value="Turquie">Turquie</option>
                  <option value="Ukraine">Ukraine</option>
                  <option value="Uruguay">Uruguay</option>
                  <option value="Venezuela">Venezuela</option>
                  <option value="Vietnam">Vietnam</option>
                  <option value="Yémen">Yémen</option>
                  <option value="Zambie">Zambie</option>
                  <option value="Zimbabwe">Zimbabwe</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="source">Source *</Label>
                <Input
                  type="select"
                  name="source"
                  id="source"
                  value={formData.source}
                  onChange={handleChange}
                  required
                >
                  <option value="EDT">EDT</option>
                  <option value="OUTLOOK">OUTLOOK</option>
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Annuler
              </Button>
              <Button color="primary" type="submit">
                {editingEvent ? "Modifier" : "Créer"}
              </Button>
            </ModalFooter>
          </Form>
        </Modal>
      </Container>
    </>
  );
};

export default Events;
