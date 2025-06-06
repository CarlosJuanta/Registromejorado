import React, { useState, useEffect, useContext } from "react";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { LuBookOpenCheck } from "react-icons/lu";
import { LuFilePlus2 } from "react-icons/lu";
import { FaPlus } from "react-icons/fa";
import { FaMousePointer } from "react-icons/fa";
import { Contexto } from "../Context/ContextProvider";
import API_URL from "../Configure";

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
} from "reactstrap";
import { NavLink, Navigate, useNavigate } from "react-router-dom";

const VerCurso = () => {
  const [modal, setModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [thirdModal, setThirdModal] = useState(false);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [datos, setDatos] = useState([]);
  const [editedCurso, setEditedCurso] = useState({
    codigoCurso: "",
    nombreCurso: "",
    descripcionCurso: "",
  });
  const { usuario } = useContext(Contexto);
  const navigate = useNavigate();
  const [gradoSeleccionado, setGradoSeleccionado] = useState(""); // Nuevo estado para almacenar el grado seleccionado
  const [grados, setGrados] = useState([]); // Nuevo estado para almacenar la lista de grados

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleEditModal = () => {
    setEditModal(!editModal);
  };

  const toggleThirdModal = () => {
    setThirdModal(!thirdModal);
  };

  const handleVerClick = (curso) => {
    setSelectedCurso(curso);
    toggleModal();
  };
  const handleEditClick = (curso) => {
    setSelectedCurso(curso);
    // Carga los valores del docente seleccionado en el estado local de edición
    setEditedCurso({
      codigoCurso: curso.codigoCurso,
      nombreCurso: curso.nombreCurso,
      descripcionCurso: curso.descripcionCurso,
      // Carga otros valores aquí
    });
    toggleEditModal();
  };

  const handleEliminarClick = (curso) => {
    setSelectedCurso(curso);
    toggleThirdModal();
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCurso({
      ...editedCurso,
      [name]: value,
    });
  };

  const getCursos = async () => {
    try {
      // Reemplaza la URL de la API con la correcta para obtener cursos
      const response = await fetch(`${API_URL}/curso/getall`);
      const data = await response.json();

      // Filtra los cursos por nombre si se ha ingresado un valor en el campo de búsqueda
      const cursosFiltrados = filtroNombre
        ? data.resultado.filter((curso) =>
            curso.nombreCurso.toLowerCase().includes(filtroNombre.toLowerCase())
          )
        : data.resultado;

      setDatos(cursosFiltrados);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarCurso = async () => {
    try {
      if (!selectedCurso || !editedCurso) {
        console.log(
          "No se ha seleccionado un curso o no se han editado datos."
        );
        return;
      }

      // Realiza una solicitud PUT para actualizar los datos del curso
      const response = await fetch(
        `${API_URL}/curso/update/${selectedCurso._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedCurso),
        }
      );

      if (response.status === 200) {
        // Actualiza la lista de cursos después de la edición
        getCursos();
        toggleEditModal();
        alert("Edición exitosa");
      } else {
        console.log("Error al editar el curso.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeGrado = (e) => {
    setGradoSeleccionado(e.target.value);
  };

  const agregarGradoACurso = async () => {
    try {
      if (!gradoSeleccionado) {
        console.log("Selecciona un grado antes de guardar.");
        return;
      }

      const idCurso = selectedCurso._id;
      const gradoData = { codigoGrado: gradoSeleccionado };
      console.log("ID del Curso:", idCurso);
      console.log("Datos del Grado:", gradoData);

      const response = await fetch(`${API_URL}/curso/asignarGrado/${idCurso}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gradoData),
      });

      if (response.status === 200) {
        const updatedCurso = await response.json();
        setSelectedCurso(updatedCurso.curso);
        toggleModal();
        alert("Asignación de grado exitosa");
      } else {
        console.log("Error al asignar el grado al curso.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const eliminiarGradodeCurso = async () => {
    try {
      if (!gradoSeleccionado) {
        console.log("Selecciona un grado antes de guardar.");
        return;
      }

      const idCurso = selectedCurso._id;
      const gradoData = { codigoGrado: gradoSeleccionado };
      console.log("ID del Curso:", idCurso);
      console.log("Datos del Grado:", gradoData);

      const response = await fetch(`${API_URL}/curso/quitarGrado/${idCurso}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(gradoData),
      });
      if (response.status === 200) {
        const updatedCurso = await response.json();
        setSelectedCurso(updatedCurso.curso);
        toggleThirdModal();
        alert("Eliminación de grado exitosa");
      } else {
        console.log("Error al eliminar el grado al curso.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    async function fetchGrados() {
      try {
        const response = await fetch(`${API_URL}/grado/getall`);
        const data = await response.json();
        setGrados(data.resultado || []);
      } catch (error) {
        console.log(error);
      }
    }

    fetchGrados();
  }, []);

  if (!usuario) {
    navigate("/login");
  } else {
    if (usuario.rol === "admin") {
      return (
        <>
          <div className="d-flex flex-column align-items-center mt-3 mb-3">
            <span>
              <LuBookOpenCheck
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
              Curso
            </h5>
          </div>
          <div className="p-5">
            <Row className="mb-3">
              <Col md={8}>
                <div className="input-group">
                  <Input
                    placeholder="Buscar Cursos"
                    type="text"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") getCursos();
                    }}
                  />
                  <Button
                    color="primary"
                    onClick={getCursos}
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
                <NavLink to="/crearcurso">
                  <Button color="success">
                    Crear Curso <LuFilePlus2 size={25} />{" "}
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
                  {/* El contenido de la tabla se mostrará solo si hay datos */}
                  <thead className="table-dark text-center fs-6 sticky-top">
                    <tr>
                      <th scope="col">No.</th>
                      <th scope="col">Código</th>
                      <th scope="col">Nombre</th>
                      <th scope="col">Descripción</th>
                      <th scope="col" style={{ width: "150px" }}>
                        Grado Asignado{" "}
                      </th>
                      <th scope="col">Acciones</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody className="table text-center">
                    {datos.map((curso) => (
                      <tr key={curso.codigoCurso} className="align-middle">
                        <td>{datos.indexOf(curso) + 1}</td>
                        <td>{curso.codigoCurso}</td>
                        <td>{curso.nombreCurso}</td>
                        <td>{curso.descripcionCurso}</td>
                        <td>
                          <a
                            href="#"
                            className="  me-2 d-flex flex-column align-items-center mt-2 mb-2"
                            style={{ textDecoration: "none" }}
                            title="Ver"
                            onClick={(e) => {
                              e.preventDefault();
                              handleVerClick(curso);
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
                          <a
                            href="#"
                            className=" me-2 d-flex flex-column align-items-center mt-2 mb-2"
                            style={{ textDecoration: "none" }}
                            title="Editar"
                            onClick={(e) => {
                              e.preventDefault();
                              handleEditClick(curso);
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
                          <a
                            href="#"
                            className="  me-2 d-flex flex-column align-items-center mt-2 mb-2"
                            style={{ textDecoration: "none" }}
                            title="Registrar"
                            onClick={(e) => {
                              e.preventDefault();
                              handleEliminarClick(curso);
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No se encontraron resultados.</p>
              )}
            </div>
          </div>

          <Modal isOpen={thirdModal} toggle={toggleThirdModal}>
            <ModalHeader toggle={toggleThirdModal}>
              Quitar grado de curso
            </ModalHeader>
            <ModalBody>
              {selectedCurso && (
                <>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Código Grado</th>
                          <th>Nombre del Grado</th>
                          <th>Sección</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCurso.codigoGrado.map((grado, index) => (
                          <tr key={index}>
                            <td>{grado.codigoGrado}</td>
                            <td>{grado.nombreGrado}</td>
                            <td>{grado.seccionGrado}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <FormGroup>
                    <Label for="gradoSelect">Seleccionar Grado</Label>
                    <Input
                      type="select"
                      name="gradoSelect"
                      id="gradoSelect"
                      value={gradoSeleccionado}
                      onChange={handleChangeGrado}
                    >
                      <option value="">Seleccionar...</option>
                      {grados.map((grado) => (
                        <option key={grado.codigoGrado} value={grado._id}>
                          {grado.nombreGrado} {grado.seccionGrado}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={eliminiarGradodeCurso}>
                Guardar
              </Button>
              <Button color="secondary" onClick={toggleThirdModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={modal} toggle={toggleModal}>
            <ModalHeader toggle={toggleModal}>
              Información del grado asignado
            </ModalHeader>
            <ModalBody>
              {selectedCurso && (
                <>
                  <div style={{ maxHeight: "200px", overflowY: "auto" }}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Código Grado</th>
                          <th>Nombre del Grado</th>
                          <th>Sección</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCurso.codigoGrado.map((grado, index) => (
                          <tr key={index}>
                            <td>{grado.codigoGrado}</td>
                            <td>{grado.nombreGrado}</td>
                            <td>{grado.seccionGrado}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <FormGroup>
                    <Label for="gradoSelect">Seleccionar Grado</Label>
                    <Input
                      type="select"
                      name="gradoSelect"
                      id="gradoSelect"
                      value={gradoSeleccionado}
                      onChange={handleChangeGrado}
                    >
                      <option value="">Seleccionar...</option>
                      {grados.map((grado) => (
                        <option
                          key={grado.codigoGrado}
                          value={grado.codigoGrado}
                        >
                          {grado.nombreGrado} {grado.seccionGrado}
                        </option>
                      ))}
                    </Input>
                  </FormGroup>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={agregarGradoACurso}>
                Guardar
              </Button>
              <Button color="secondary" onClick={toggleModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={editModal} toggle={toggleEditModal}>
            <ModalHeader toggle={toggleEditModal}>Editar Curso</ModalHeader>
            <ModalBody>
              {selectedCurso && (
                <>
                  <FormGroup>
                    <Label for="codigoCurso">Código del Curso</Label>
                    <Input
                      type="text-area"
                      id="codigoCurso"
                      name="codigoCurso"
                      value={editedCurso.codigoCurso}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="nombreCurso">Nombre del Curso</Label>
                    <Input
                      type="text-area"
                      id="nombreCurso"
                      name="nombreCurso"
                      value={editedCurso.nombreCurso}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for="descripcionCurso">Descripción del Curso</Label>
                    <Input
                      type="textarea"
                      id="descripcionCurso"
                      name="descripcionCurso"
                      value={editedCurso.descripcionCurso}
                      onChange={handleEditInputChange}
                    />
                  </FormGroup>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleEditarCurso}>
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

export default VerCurso;
