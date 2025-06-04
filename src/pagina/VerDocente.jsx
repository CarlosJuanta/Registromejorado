import React, { useState, useContext, useEffect } from "react";
import API_URL from "../Configure";
import { Contexto } from "../Context/ContextProvider";
import { FaEdit } from "react-icons/fa";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { FaSearch } from "react-icons/fa";

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
          <div className="d-flex flex-column align-items-center mt-3 mb-3">
            <span>
              <LiaChalkboardTeacherSolid
                size={55}
                color="white"
                style={{
                  filter: "blur(0.8px) drop-shadow(0 0 8px #fff)",
                }}
              />
            </span>
            <h5
              className=" fw-bold mt-2 mb-0"
              style={{
                filter: "drop-shadow(0 0 0.6px #000)",
              }}
            >
              Docente
            </h5>
          </div>
          <div className="p-5">
            <Row className="mb-3">
              <Col md={8}>
                <div className="input-group">
                  <Input
                    placeholder="Buscar Docente por Nombre"
                    type="text"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") getDocentes();
                    }}
                  />
                  <Button
                    color="primary"
                    onClick={getDocentes}
                    style={{
                      borderTopLeftRadius: 0,
                      borderBottomLeftRadius: 0,
                    }}
                  >
                    <FaSearch />
                  </Button>
                </div>
              </Col>
              <Col className="text-start text-md-end pt-md-0 pt-3">
                <NavLink to="/docente">
                  <Button color="success">
                    Crear Docente <FaIcons.FaUserTie size={20} />
                  </Button>
                </NavLink>
              </Col>
            </Row>
          </div>
          <div className="px-5 rounded-4" style={{}}>
            <div
              style={{
                maxHeight: "75vh",
                overflowY: "auto",
                borderRadius: "1rem",
              }}
            >
              {datos.length > 0 ? (
                <>
                  <table
                    className="table table-light border table-hover table-sm rounded-2 shadow align-middle font-monospace"
                    style={{ borderRadius: "1rem" }}
                  >
                    <thead className="table-dark text-center fs-6 sticky-top">
                      <tr>
                        <th scope="col">No.</th>
                        <th scope="col">CUI</th>
                        <th scope="col">Nombres</th>
                        <th scope="col">Apellidos</th>
                        <th scope="col">Teléfono</th>
                        <th scope="col">Correo</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Nacionalidad</th>
                        <th scope="col">Acciones</th>
                        <th scope="col">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="table text-center">
                      {datos.map((docente) => (
                        <tr key={docente.cuiDocente}>
                          <td>{datos.indexOf(docente) + 1}</td>
                          <td>{docente.cuiDocente}</td>
                          <td>{docente.nombreDocente}</td>
                          <td>{docente.apellidoDocente}</td>
                          <td>{docente.telefonoDocente}</td>
                          <td>
                            <a href={`mailto:${docente.correoDocente}`}>
                              {docente.correoDocente}
                            </a>
                          </td>
                          <td>{docente.direccionDocente}</td>
                          <td>{docente.nacionalidadDocente}</td>

                          <td>
                            <a
                              href="#"
                              className="  me-2 d-flex flex-column align-items-center mt-2 mb-2"
                              style={{ textDecoration: "none" }}
                              title="Editar"
                              onClick={(e) => {
                                e.preventDefault();
                                handleVerClick(docente);
                              }}
                            >
                              <FaEdit size={30} color="rgb(39 145 14)" />
                              <span
                                style={{
                                  fontSize: "10px",
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                Editar
                              </span>
                            </a>
                          </td>
                          <td>
                            {docente.estadoDocente === false ? (
                              <span className="text-danger">Inactivo</span>
                            ) : (
                              <span className="text-success">Activo</span>
                            )}
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
