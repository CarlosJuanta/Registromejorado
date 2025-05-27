import React, { useState, useContext, useEffect } from "react";
import API_URL from "../Configure";
import { Contexto } from "../Context/ContextProvider";
import {
  Input,
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Label,
  FormGroup,
  Form,
} from "reactstrap";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

const VerDocente = () => {
  const [modal, setModal] = useState(false);
  const [selectedDocente, setSelectedDocente] = useState();
  const [filtroNombre, setFiltroNombre] = useState("");
  const [datos, setDatos] = useState([]);
  const [totalDocentes, setTotalDocentes] = useState(0); // Nuevo estado para el total
  const { usuario } = useContext(Contexto);
  const navigate = useNavigate();
  const [editedDocente, setEditedDocente] = useState({
    cuiDocente: "",
    nombreDocente: "",
    apellidoDocente: "",
    telefonoDocente: "",
    correoDocente: "",
    direccionDocente: "",
    nacionalidadDocente: "",
    rol: "",
    username: "",
    password: "",
    estadoDocente: false, // Estado por defecto es falso (inactivo)
    // Agrega otros campos de edición aquí
  });

  const toggleModal = () => {
    setModal(!modal);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedDocente({ ...editedDocente, [name]: value });
  };

  // Función de manejo de cambios para el checkbox de estado del estudiante
  const handleEditCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditedDocente({
      ...editedDocente,
      [name]: checked,
    });
  };

  const handleVerClick = (docente) => {
    setSelectedDocente(docente);
    // Carga los valores del docente seleccionado en el estado local de edición
    setEditedDocente({
      cuiDocente: docente.cuiDocente,
      nombreDocente: docente.nombreDocente,
      apellidoDocente: docente.apellidoDocente,
      telefonoDocente: docente.telefonoDocente,
      correoDocente: docente.correoDocente,
      direccionDocente: docente.direccionDocente,
      nacionalidadDocente: docente.nacionalidadDocente,
      rol: docente.rol,
      username: docente.username,
      password: docente.password,
      estadoDocente: docente.estadoDocente,
      // Carga otros valores aquí
    });
    toggleModal();
  };

  const getDocentes = async () => {
    try {
      const response = await fetch(`${API_URL}/docente/getall`);
      const data = await response.json();
      // Calcula el total de docentes registrados
      const totalDocentesRegistrados = data.resultado.length;
      // Filtra los docentes por nombre si se ha ingresado un valor en el campo de búsqueda
      const docentesFiltrados = filtroNombre
        ? data.resultado.filter((docente) =>
            docente.nombreDocente
              .toLowerCase()
              .includes(filtroNombre.toLowerCase())
          )
        : data.resultado;
      setDatos(docentesFiltrados);
      setTotalDocentes(totalDocentesRegistrados);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarDocente = async () => {
    try {
      if (!selectedDocente || !editedDocente) {
        console.log(
          "No se ha seleccionado un docente o no se han editado datos."
        );
        return;
      }

      // Mostrar una ventana emergente de confirmación
      const confirmacion = window.confirm(
        "¿Estás seguro de que deseas editar este docente?"
      );

      if (confirmacion) {
        // Realiza una solicitud PUT para actualizar los datos del docente
        const response = await fetch(
          `${API_URL}/docente/update/${selectedDocente._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedDocente),
          }
        );

        if (response.status === 200) {
          // Actualiza la lista de docentes después de la edición
          getDocentes();
          toggleModal();
          alert("Edición exitosa");
        } else {
          console.log("Error al editar el docente.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!usuario) {
    navigate("/login");
  } else {
    if (usuario.rol === "admin") {
      return (
        <>
          <h4>Docente</h4>
          <div className="p-5">
            <Row>
              <Col>
                <Button
                  color="primary"
                  onClick={() => {
                    getDocentes();
                  }}
                >
                  Buscar
                </Button>
              </Col>
            </Row>
            <div style={{ marginTop: "20px" }}></div>
            <Row>
              <Col sm={12} md={6}>
                <Input
                  placeholder="Buscar Docente por Nombre"
                  type="text-area"
                  value={filtroNombre}
                  onChange={(e) => setFiltroNombre(e.target.value)}
                />
              </Col>
              <Col className="text-end">
                <NavLink to="/docente">
                  <Button color="success">Registrar Docente</Button>
                </NavLink>
              </Col>
            </Row>
          </div>
          <div className="table-responsive p-5">
            {datos.length > 0 ? (
              <>
                <p className="negrita">
                  Total de docentes registrados: {totalDocentes}
                </p>
                <table className="table table-hover table-light table-sm align-middle table-striped">
                  {/* El contenido de la tabla se mostrará solo si hay datos */}
                  <thead className="table-dark table text-center">
                    <tr>
                      <th scope="col">CUI</th>
                      <th scope="col">Nombres</th>
                      <th scope="col">Apellidos</th>
                      <th scope="col">Teléfono</th>
                      <th scope="col">Correo</th>
                      <th scope="col">Dirección</th>
                      <th scope="col">Nacionalidad</th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table text-center">
                    {datos.map((docente) => (
                      <tr key={docente.cuiDocente}>
                        <td>{docente.cuiDocente}</td>
                        <td>{docente.nombreDocente}</td>
                        <td>{docente.apellidoDocente}</td>
                        <td>{docente.telefonoDocente}</td>
                        <td>{docente.correoDocente}</td>
                        <td>{docente.direccionDocente}</td>
                        <td>{docente.nacionalidadDocente}</td>
                        <td>
                          <td className="negrita">
                            <Button
                              color="warning"
                              onClick={() => {
                                handleVerClick(docente);
                              }}
                            >
                              Editar
                            </Button>
                          </td>
                          <td className="negrita">
                            {docente.estadoDocente === false ? (
                              <span className="text-danger">Inactivo</span>
                            ) : (
                              <span className="text-success">Activo</span>
                            )}
                          </td>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <p>No se encontraron resultados.</p>
            )}
          </div>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Detalles del Docente</ModalHeader>
            <ModalBody>
              {selectedDocente && (
                <>
                  <p>
                    <strong>CUI:</strong> {selectedDocente.cuiDocente}
                  </p>
                  <p>
                    <strong>Nombres:</strong> {selectedDocente.nombreDocente}
                  </p>
                  <p>
                    <strong>Apellidos:</strong>{" "}
                    {selectedDocente.apellidoDocente}
                  </p>
                  <p>
                    <strong>Teléfono:</strong> {selectedDocente.telefonoDocente}
                  </p>
                  <p>
                    <strong>Correo:</strong> {selectedDocente.correoDocente}
                  </p>
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {selectedDocente.direccionDocente}
                  </p>
                  <p>
                    <strong>Nacionalidad:</strong>{" "}
                    {selectedDocente.nacionalidadDocente}
                  </p>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cerrar
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>Editar Docente</ModalHeader>
            <ModalBody>
              {selectedDocente && (
                <>
                  <FormGroup>
                    <Label for="cuiDocente">CUI</Label>
                    <Input
                      type="text-area"
                      id="cuiDocente"
                      name="cuiDocente"
                      value={editedDocente.cuiDocente}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="nombreDocente">Nombre</Label>
                    <Input
                      type="text-area"
                      id="nombreDocente"
                      name="nombreDocente"
                      value={editedDocente.nombreDocente}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="apellidoDocente">Apellido</Label>
                    <Input
                      type="text-area"
                      id="apellidoDocente"
                      name="apellidoDocente"
                      value={editedDocente.apellidoDocente}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="telefonoDocente">Teléfono</Label>
                    <Input
                      type="text-area"
                      id="telefonoDocente"
                      name="telefonoDocente"
                      value={editedDocente.telefonoDocente}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="correoDocente">Correo</Label>
                    <Input
                      type="email"
                      id="correoDocente"
                      name="correoDocente"
                      value={editedDocente.correoDocente}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="direccionDocente">Dirección</Label>
                    <Input
                      type="text-area"
                      id="direccionDocente"
                      name="direccionDocente"
                      value={editedDocente.direccionDocente}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="nacionalidadDocente">Nacionalidad</Label>
                    <Input
                      type="text-area"
                      id="nacionalidadDocente"
                      name="nacionalidadDocente"
                      value={editedDocente.nacionalidadDocente}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="rol">Rol</Label>
                    <Input
                      type="text-area"
                      id="rol"
                      name="rol"
                      value={editedDocente.rol}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="username">Usuario</Label>
                    <Input
                      type="text-area"
                      id="username"
                      name="username"
                      value={editedDocente.username}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="password">Contraseña</Label>
                    <Input
                      type="text-area"
                      id="password"
                      name="password"
                      value={editedDocente.password}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="estadoDocente">Estado Docente: </Label>
                    <Input
                      type="checkbox"
                      id="estadoDocente"
                      name="estadoDocente"
                      checked={editedDocente.estadoDocente}
                      onChange={handleEditCheckboxChange}
                    />
                  </FormGroup>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleEditarDocente}>
                Guardar
              </Button>
              <Button color="secondary" onClick={toggleModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>
        </>
      );
    } else {
      return <Navigate to="/" />;
    }
  }
};

export default VerDocente;
