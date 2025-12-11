import React, { useState, useEffect } from "react";
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
  Alert,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import Header from "components/Headers/Header.js";
import api from "../../services/api";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState("");

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/users");
      console.log("Users response:", response.data);
      setUsers(response.data || []);
    } catch (err) {
      console.error("Error loading users:", err);
      const errorMessage = err.response?.data?.message || err.message || "Erreur lors du chargement des utilisateurs";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (user) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setModalOpen(true);
  };

  const saveRoleChange = async () => {
    try {
      await api.put(`/users/${selectedUser.id}/role`, { role: newRole });
      setSuccess(`Rôle de ${selectedUser.username} modifié avec succès`);
      setModalOpen(false);
      loadUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error updating role:", err);
      setError("Erreur lors de la modification du rôle");
    }
  };

  const handleDelete = async (userId, username) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${username} ?`)) {
      try {
        await api.delete(`/users/${userId}`);
        setSuccess(`Utilisateur ${username} supprimé avec succès`);
        loadUsers();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        console.error("Error deleting user:", err);
        setError("Erreur lors de la suppression de l'utilisateur");
      }
    }
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
                <h3 className="mb-0">Gestion des Utilisateurs</h3>
              </CardHeader>
              <Table className="align-items-center table-flush" responsive>
                <thead className="thead-light">
                  <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Nom d'utilisateur</th>
                    <th scope="col">Email</th>
                    <th scope="col">Rôle</th>
                    <th scope="col">Date de création</th>
                    <th scope="col" />
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Chargement...
                      </td>
                    </tr>
                  ) : users.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center">
                        Aucun utilisateur trouvé
                      </td>
                    </tr>
                  ) : (
                    users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td>
                          <Badge color={user.role === "admin" ? "success" : "info"}>
                            {user.role}
                          </Badge>
                        </td>
                        <td>
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString("fr-FR")
                            : "-"}
                        </td>
                        <td className="text-right">
                          <UncontrolledDropdown>
                            <DropdownToggle
                              className="btn-icon-only text-light"
                              href="#"
                              role="button"
                              size="sm"
                              color=""
                              onClick={(e) => e.preventDefault()}
                            >
                              <i className="fas fa-ellipsis-v" />
                            </DropdownToggle>
                            <DropdownMenu className="dropdown-menu-arrow" right>
                              <DropdownItem onClick={() => handleRoleChange(user)}>
                                <i className="fas fa-user-tag" /> Modifier le rôle
                              </DropdownItem>
                              <DropdownItem
                                onClick={() => handleDelete(user.id, user.username)}
                              >
                                <i className="fas fa-trash" /> Supprimer
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
                <nav aria-label="...">
                  <small className="text-muted">
                    Total : {users.length} utilisateur(s)
                  </small>
                </nav>
              </CardFooter>
            </Card>
          </div>
        </Row>

        {/* Modal pour modifier le rôle */}
        <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)}>
          <ModalHeader toggle={() => setModalOpen(false)}>
            Modifier le rôle de {selectedUser?.username}
          </ModalHeader>
          <ModalBody>
            <FormGroup>
              <Label for="roleSelect">Rôle</Label>
              <Input
                type="select"
                name="role"
                id="roleSelect"
                value={newRole}
                onChange={(e) => setNewRole(e.target.value)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Input>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => setModalOpen(false)}>
              Annuler
            </Button>
            <Button color="primary" onClick={saveRoleChange}>
              Enregistrer
            </Button>
          </ModalFooter>
        </Modal>
      </Container>
    </>
  );
};

export default Users;
