import React, { useState, useEffect, useContext } from "react";
import API_URL from "../Configure";
import { FaSearch } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { BsFillClipboard2PlusFill } from "react-icons/bs";
import { SiGoogleclassroom } from "react-icons/si";
import { Contexto } from "../Context/ContextProvider";

import {
  FormGroup,
  Label,
  Input,
  Col,
  Row,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { NavLink, Navigate, useNavigate } from "react-router-dom";

const VerGrado = () => {
  const [modal, setModal] = useState(false);
  const [secondModal, setsecondModal] = useState(false);
  const [thirdModal, setthirdModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedGrado, setSelectedGrado] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [datos, setDatos] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [docentes, setDocentes] = useState([]);
  const [editedGrado, setEditedGrado] = useState({
    codigoGrado: "",
    nombreGrado: "",
    descripcionGrado: "",
    seccionGrado: "",
  });
  const { usuario } = useContext(Contexto);
  const navigate = useNavigate();

  const toggleModal = () => {
    setModal(!modal);
  };

  const togglesecondModal = () => {
    setsecondModal(!secondModal);
  };

  const togglethirdModal = () => {
    setthirdModal(!thirdModal);
  };

  const toggleEditModal = () => {
    setEditModal(!editModal);
  };

  const handleVerClick = (grado) => {
    setSelectedGrado(grado);
    toggleModal();
  };

  const handleAsignarClick = (grado) => {
    setSelectedGrado(grado);
    togglesecondModal();
  };

  const handleEliminarClick = (grado) => {
    setSelectedGrado(grado);
    togglethirdModal();
  };

  const handleEditClick = (grado) => {
    setSelectedGrado(grado);
    setEditedGrado({
      codigoGrado: grado.codigoGrado,
      nombreGrado: grado.nombreGrado,
      descripcionGrado: grado.descripcionGrado,
      seccionGrado: grado.seccionGrado,
    });
    toggleEditModal();
  };

  const handleEditarGrado = async () => {
    try {
      if (!selectedGrado || !editedGrado) {
        console.log(
          "No se ha seleccionado un grado o no se han editado datos."
        );
        return;
      }

      // Realiza una solicitud PUT para actualizar los datos del grado
      const response = await fetch(
        `${API_URL}/grado/update/${selectedGrado._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedGrado),
        }
      );

      if (response.status === 200) {
        // Actualiza la lista de grados después de la edición
        getGrados();
        toggleEditModal(); // Asegúrate de que el nombre de tu modal sea correcto
        alert("Edición exitosa");
      } else {
        console.log("Error al editar el grado.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedGrado({
      ...editedGrado,
      [name]: value,
    });
  };

  const handleChangeGrado = (e) => {
    setGradoSeleccionado(e.target.value);
  };

  const agregarDocenteAGrado = async () => {
    try {
      if (!gradoSeleccionado) {
        console.log("Selecciona un docente antes de guardar.");
        return;
      }

      const idGrado = selectedGrado._id;
      const docenteData = { cuiDocente: gradoSeleccionado };
      console.log("ID del Grado:", idGrado);
      console.log("Datos del Docente:", docenteData);

      const response = await fetch(
        `${API_URL}/grado/asignarDocente/${idGrado}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(docenteData),
        }
      );

      if (response.status === 200) {
        const updatedGrado = await response.json();
        setSelectedGrado(updatedGrado.grado);
        togglesecondModal();
        alert("Asignación de docente exitosa");
      } else {
        console.log("Error al asignar el docente al grado.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarDocenteAGrado = async () => {
    try {
      if (!gradoSeleccionado) {
        console.log("Selecciona un docente antes de guardar.");
        return;
      }

      const idGrado = selectedGrado._id;
      const docenteData = { cuiDocente: gradoSeleccionado };
      console.log("ID del Grado:", idGrado);
      console.log("Datos del Docente:", docenteData);

      const response = await fetch(
        `${API_URL}/grado/quitarDocente/${idGrado}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(docenteData),
        }
      );

      if (response.status === 200) {
        const updatedGrado = await response.json();
        setSelectedGrado(updatedGrado.grado);
        togglethirdModal();
        alert("Eliminación de docente exitosa");
      } else {
        console.log("Error al asignar el docente al grado.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchDocentes() {
      try {
        const response = await fetch(`${API_URL}/docente/getall`);
        const data = await response.json();
        setDocentes(data.resultado || []);
      } catch (error) {
        console.log(error);
      }
    }

    fetchDocentes();
  }, []);

  const getGrados = async () => {
    try {
      const response = await fetch(`${API_URL}/grado/getall`);
      const data = await response.json();

      const gradosFiltrados = filtroNombre
        ? data.resultado.filter((grado) =>
            grado.nombreGrado.toLowerCase().includes(filtroNombre.toLowerCase())
          )
        : data.resultado;

      setDatos(gradosFiltrados);
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
              <SiGoogleclassroom
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
                filter: "drop-shadow(0 0 0.7px #000)",
              }}
            >
              Grado
            </h5>
          </div>
          <div className="p-5">
            <Row className="mb-3">
              <Col md={8}>
                <div className="input-group">
                  <Input
                    placeholder="Buscar Grados"
                    type="text"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") getGrados();
                    }}
                  />
                  <Button
                    color="primary"
                    onClick={getGrados}
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
                <NavLink to="/grado">
                  <Button color="success">
                    Crear Grado <FaPlus size={15} />
                  </Button>
                </NavLink>
              </Col>
            </Row>
          </div>
          <div className="px-5" style={{}}>
            <div
              style={{
                maxHeight: "70vh",
                overflowY: "auto",
                borderRadius: "1rem",
              }}
            >
              {datos.length > 0 ? (
                <table
                  className="table table-light border table-hover table-sm rounded-2 shadow align-middle font-monospace"
                  style={{ borderRadius: "1rem" }}
                >
                  <thead className="table-dark text-center fs-6 sticky-top">
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Código</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Descripción</th>
                      <th scope="col" style={{ width: "50px" }}>
                        Sección
                      </th>
                      <th scope="col">Docentes Asignado</th>
                      <th scope="col" style={{ width: "100px" }}>
                        Asignaciones Docentes
                      </th>
                      <th scope="col">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="table text-center">
                    {datos.map((grado) => (
                      <tr key={grado.codigoGrado}>
                        <td>{datos.indexOf(grado) + 1}</td>
                        <td>{grado.codigoGrado}</td>
                        <td>{grado.nombreGrado}</td>
                        <td>{grado.descripcionGrado}</td>
                        <td>{grado.seccionGrado}</td>
                        <td>
                          <a
                            href="#"
                            className="  me-2 d-flex flex-column align-items-center mt-2 mb-2"
                            style={{ textDecoration: "none" }}
                            title="Ver"
                            onClick={(e) => {
                              e.preventDefault();
                              handleVerClick(grado);
                            }}
                          >
                            <FaEye size={30} color="rgb(36 101 147)" />
                            <span
                              style={{
                                fontSize: "10px",
                                textDecoration: "none",
                                color: "black",
                              }}
                            >
                              Ver
                            </span>
                          </a>
                        </td>
                        <td>
                          <td>
                            <a
                              href="#"
                              className="  me-2 d-flex flex-column align-items-center mt-2 mb-2"
                              style={{ textDecoration: "none" }}
                              title="Asignar"
                              onClick={(e) => {
                                e.preventDefault();
                                handleAsignarClick(grado);
                              }}
                            >
                              <FaPlus size={30} color="rgb(77 161 169)" />
                              <span
                                style={{
                                  fontSize: "10px",
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                Asignar
                              </span>
                            </a>
                          </td>
                          <td>
                            <a
                              href="#"
                              className="  me-2 d-flex flex-column align-items-center mt-2 mb-2"
                              style={{ textDecoration: "none" }}
                              title="Eliminar"
                              onClick={(e) => {
                                e.preventDefault();
                                handleEliminarClick(grado);
                              }}
                            >
                              <FaTrash size={30} color="#b12121c9" />
                              <span
                                style={{
                                  fontSize: "10px",
                                  textDecoration: "none",
                                  color: "black",
                                }}
                              >
                                Eliminar
                              </span>
                            </a>
                          </td>
                        </td>
                        <td>
                          <a
                            href="#"
                            className="  me-2 d-flex flex-column align-items-center mt-2 mb-2"
                            style={{ textDecoration: "none" }}
                            title="Editar"
                            onClick={(e) => {
                              e.preventDefault();
                              handleEditClick(grado);
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No se encontraron resultados.</p>
              )}
            </div>
          </div>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>
              Información del Docente
            </ModalHeader>
            <ModalBody>
              {selectedGrado && (
                <>
                  <table className="table">
                    <thead>
                      <tr>
                        <th>CUI Docente</th>
                        <th>Nombre Docente</th>
                        <th>Apellido Docente</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedGrado.cuiDocente.map((docente, index) => (
                        <tr key={index}>
                          <td>{docente.cuiDocente}</td>
                          <td>{docente.nombreDocente}</td>
                          <td>{docente.apellidoDocente}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={toggleModal}>
                Cerrar
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={secondModal} toggle={togglesecondModal}>
            <ModalHeader toggle={togglesecondModal}>
              Asignar Docente a Grado
            </ModalHeader>
            <ModalBody>
              {selectedGrado && (
                <>
                  <FormGroup>
                    <Label for="gradoSelect">Seleccionar Docente</Label>
                    <Input
                      type="select"
                      name="gradoSelect"
                      id="gradoSelect"
                      value={gradoSeleccionado}
                      onChange={handleChangeGrado}
                    >
                      <option value="">Seleccionar...</option>
                      {docentes.map((docente) => (
                        <option
                          key={docente.cuiDocente}
                          value={docente.cuiDocente}
                        >
                          {docente.nombreDocente} {docente.apellidoDocente}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={agregarDocenteAGrado}>
                Guardar
              </Button>
              <Button color="secondary" onClick={togglesecondModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={thirdModal} toggle={togglethirdModal}>
            <ModalHeader toggle={togglethirdModal}>
              Quitar Docente de Grado
            </ModalHeader>
            <ModalBody>
              {selectedGrado && (
                <>
                  <FormGroup>
                    <Label for="gradoSelect">Seleccionar Docente</Label>
                    <Input
                      type="select"
                      name="gradoSelect"
                      id="gradoSelect"
                      value={gradoSeleccionado}
                      onChange={handleChangeGrado}
                    >
                      <option value="">Seleccionar...</option>
                      {docentes.map((docente) => (
                        <option key={docente.cuiDocente} value={docente._id}>
                          {docente.nombreDocente} {docente.apellidoDocente}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={eliminarDocenteAGrado}>
                Guardar
              </Button>
              <Button color="secondary" onClick={togglethirdModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>
          <Modal isOpen={editModal} toggle={toggleEditModal}>
            <ModalHeader toggle={toggleEditModal}>Editar Grado</ModalHeader>
            <ModalBody>
              {selectedGrado && (
                <>
                  <FormGroup>
                    <Label for="códigoGrado">Código Grado</Label>
                    <Input
                      type="text-area"
                      id="codigoGrado"
                      name="codigoGrado"
                      value={editedGrado.codigoGrado}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="nombreGrado">Nombre del Grado</Label>
                    <Input
                      type="text-area"
                      id="nombreGrado"
                      name="nombreGrado"
                      value={editedGrado.nombreGrado}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="descripcionGrado">Descripción del Grado</Label>
                    <Input
                      type="text-area"
                      id="descripcionGrado"
                      name="descripcionGrado"
                      value={editedGrado.descripcionGrado}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="nivelGrado">Sección</Label>
                    <Input
                      type="text-area"
                      id="seccionGrado"
                      name="seccionGrado"
                      value={editedGrado.seccionGrado}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  {/* Agrega otros campos de edición aquí */}
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleEditarGrado}>
                Guardar
              </Button>
              <Button color="secondary" onClick={toggleEditModal}>
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

export default VerGrado;
