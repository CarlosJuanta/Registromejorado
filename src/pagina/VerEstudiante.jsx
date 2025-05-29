import React, { useState, useEffect, useContext } from "react";
import { Contexto } from "../Context/ContextProvider";
import { FaSearch } from "react-icons/fa";
import API_URL from "../Configure";
import "../Styles/style.css";
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

const VerEstudiante = () => {
  const [modal, setModal] = useState(false);
  const [secondModal, setSecondModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedEncargado, setSelectedEncargado] = useState();
  const [filtroNombre, setFiltroNombre] = useState("");
  const [datos, setDatos] = useState([]);
  const [gradoSeleccionado, setGradoSeleccionado] = useState("");
  const [selectedGradoAsignado, setSelectedGradoAsignado] = useState("");
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [grados, setGrados] = useState([]);
  const { usuario } = useContext(Contexto);
  const navigate = useNavigate();
  // Estado local para los campos de edición
  const [editedEstudiante, setEditedEstudiante] = useState({
    nombreEstudiante: "",
    apellidoEstudiante: "",
    fechanacEstudiante: "",
    direccionEstudiante: "",
    nacionalidadEstudiante: "",
    codigomineducEstudiante: "",
    cuiencargadoEstudiante: "",
    nombreencargadoEstudiante: "",
    apellidoencargadoEstudiante: "",
    direccionencargadoEstudiante: "",
    telefonoencargadoEstudiante: "",
    correencargadoEstudiante: "",
    gradoEstudiante: "",
    estadoEstudiante: false, // Estado por defecto es falso (inactivo)
    // Agrega otros campos de edición aquí
  });

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

  const toggleModal = () => {
    setModal(!modal);
  };

  const toggleSecondModal = () => {
    setSecondModal(!secondModal);
  };

  const toggleEditModal = () => {
    setEditModal(!editModal);
  };
  const toggleDeleteModal = () => {
    setDeleteModal(!deleteModal);
  };

  const handleVerClick = (estudiante) => {
    setSelectedEncargado(estudiante);
    toggleModal();
  };

  const handleAsignarGrado = (estudiante) => {
    setSelectedGradoAsignado(estudiante);
    toggleSecondModal();
  };

  const handleEliminarGrado = (estudiante) => {
    setSelectedGradoAsignado(estudiante);
    toggleDeleteModal();
  };

  // Función de manejo de cambios para el checkbox de estado del estudiante
  const handleEditCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setEditedEstudiante({
      ...editedEstudiante,
      [name]: checked,
    });
  };

  const handleEditarClick = (estudiante) => {
    setSelectedEstudiante(estudiante);
    // Carga los valores del estudiante seleccionado en el estado local de edición
    setEditedEstudiante({
      nombreEstudiante: estudiante.nombreEstudiante,
      apellidoEstudiante: estudiante.apellidoEstudiante,
      fechanacEstudiante: estudiante.fechanacEstudiante,
      direccionEstudiante: estudiante.direccionEstudiante,
      nacionalidadEstudiante: estudiante.nacionalidadEstudiante,
      codigomineducEstudiante: estudiante.codigomineducEstudiante,
      cuiencargadoEstudiante: estudiante.cuiencargadoEstudiante,
      nombreencargadoEstudiante: estudiante.nombreencargadoEstudiante,
      apellidoencargadoEstudiante: estudiante.apellidoencargadoEstudiante,
      direccionencargadoEstudiante: estudiante.direccionencargadoEstudiante,
      telefonoencargadoEstudiante: estudiante.telefonoencargadoEstudiante,
      correencargadoEstudiante: estudiante.correencargadoEstudiante,
      gradoEstudiante: estudiante.gradoEstudiante,
      estadoEstudiante: estudiante.estadoEstudiante,
      // Carga otros valores aquí
    });
    toggleEditModal();
  };

  const handleChangeGrado = (e) => {
    setGradoSeleccionado(e.target.value);
  };

  const agregarGradoAEstudiante = async () => {
    try {
      if (!gradoSeleccionado) {
        console.log("Selecciona un grado antes de guardar.");
        return;
      }

      const idEstudiante = selectedGradoAsignado._id;
      const gradoData = { codigoGrado: gradoSeleccionado };

      const response = await fetch(
        `${API_URL}/estudiante/agregarGrado/${idEstudiante}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(gradoData),
        }
      );

      if (response.status === 200) {
        const updatedEstudiante = await response.json();
        setSelectedGradoAsignado(updatedEstudiante.estudiante);
        toggleSecondModal();
        alert("Asignación exitosa");
      } else {
        console.log("Error al agregar el grado al estudiante.");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarGradoDeEstudiante = async () => {
    try {
      if (!gradoSeleccionado) {
        console.log("Selecciona un grado antes de eliminar.");
        return;
      }

      // Mostrar una alerta de confirmación
      const confirmacion = window.confirm(
        "¿Estás seguro de que deseas eliminar este grado del estudiante?"
      );

      if (confirmacion) {
        const idEstudiante = selectedGradoAsignado._id;
        const gradoData = { codigoGrado: gradoSeleccionado };

        const response = await fetch(
          `${API_URL}/estudiante/quitarGrado/${idEstudiante}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(gradoData),
          }
        );

        if (response.status === 200) {
          const updatedEstudiante = await response.json();
          setSelectedGradoAsignado(updatedEstudiante.estudiante);
          toggleDeleteModal();
          alert("Eliminación de grado exitosa");
        } else {
          console.log("Error al eliminar el grado del estudiante.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditarEstudiante = async () => {
    try {
      if (!selectedEstudiante || !editedEstudiante) {
        console.log(
          "No se ha seleccionado un estudiante o no se han editado datos."
        );
        return;
      }

      // Pedir confirmación antes de realizar la edición
      const confirmacion = window.confirm(
        "¿Estás seguro de que deseas editar este estudiante?"
      );

      if (confirmacion) {
        // Realiza una solicitud PUT para actualizar los datos del estudiante
        const response = await fetch(
          `${API_URL}/estudiante/update/${selectedEstudiante._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedEstudiante),
          }
        );

        if (response.status === 200) {
          // Actualiza la lista de estudiantes después de la edición
          getEstudiantes();
          toggleEditModal();
          alert("Edición exitosa");
        } else {
          console.log("Error al editar el estudiante.");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getEstudiantes = async () => {
    try {
      const response = await fetch(`${API_URL}/estudiante/getall`);
      const data = await response.json();
      const estudiantesFiltrados = filtroNombre
        ? data.resultado.filter((estudiante) =>
            new RegExp(filtroNombre, "i").test(estudiante.nombreEstudiante)
          )
        : data.resultado;
      setDatos(estudiantesFiltrados);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  // Función de manejo de cambios para los campos de edición
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditedEstudiante({
      ...editedEstudiante,
      [name]: value,
    });
  };

  if (!usuario) {
    navigate("/login");
  } else {
    if (usuario.rol === "admin") {
      return (
        <>
          <h4 className="text-center pt-3 fw-bold">Estudiante</h4>
          <div className="p-5">
            <Row className="mb-3">
              <Col md={8}>
                <div className="input-group">
                  <Input
                    placeholder="Buscar Estudiante por Nombre"
                    type="text"
                    value={filtroNombre}
                    onChange={(e) => setFiltroNombre(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") getEstudiantes();
                    }}
                  />
                  <Button
                    color="primary"
                    onClick={getEstudiantes}
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
                <NavLink to="/estudiante">
                  <Button color="success">Crear Estudiante</Button>
                </NavLink>
              </Col>
            </Row>
          </div>
          <div className="table-responsive p-5 ">
            {datos.length > 0 ? (
              <table className="table  table-sm align-middle fs-6  ">
                <thead className="table-dark table text-center">
                  <tr>
                    <th scope="col">CUI</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Apellido</th>
                    <th scope="col">Fecha de Nacimiento</th>
                    <th scope="col">Dirección</th>
                    <th scope="col">Nacionalidad</th>
                    <th scope="col">Código MINEDUC</th>
                    <th scope="col">Encargado</th>
                    <th scope="col">Grados</th>
                    <th scope="col">Estudiante</th>
                  </tr>
                </thead>
                <tbody className="table text-center">
                  {datos.map((estudiante, index) => (
                    <tr key={estudiante._id}>
                      <td>{estudiante.cuiEstudiante}</td>
                      <td>{estudiante.nombreEstudiante}</td>
                      <td>{estudiante.apellidoEstudiante}</td>
                      <td>
                        {new Date(
                          estudiante.fechanacEstudiante
                        ).toLocaleDateString("es-ES")}
                      </td>
                      <td>{estudiante.direccionEstudiante}</td>
                      <td>{estudiante.nacionalidadEstudiante}</td>
                      <td>{estudiante.codigomineducEstudiante}</td>
                      <td>
                        <Button
                          color="success"
                          onClick={() => {
                            handleVerClick(estudiante);
                          }}
                        >
                          Ver
                        </Button>
                      </td>
                      <td>
                        <td>
                          <Button
                            color="info"
                            onClick={() => {
                              handleAsignarGrado(estudiante);
                            }}
                          >
                            Asignar
                          </Button>
                        </td>
                        <td>
                          <Button
                            color="danger"
                            onClick={() => {
                              handleEliminarGrado(estudiante);
                            }}
                          >
                            Eliminar
                          </Button>
                        </td>
                      </td>
                      <td>
                        <td>
                          <Button
                            color="warning"
                            onClick={() => {
                              handleEditarClick(estudiante);
                            }}
                          >
                            Editar
                          </Button>
                        </td>
                        <td>
                          {estudiante.estadoEstudiante === false ? (
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
            ) : (
              <p>No se encontraron resultados.</p>
            )}
          </div>

          <Modal
            isOpen={modal}
            toggle={toggleModal}
            className="modal-encargado-custom"
          >
            <ModalHeader toggle={toggleModal}>
              Detalles del Encargado
            </ModalHeader>
            <ModalBody>
              {selectedEncargado && (
                <>
                  <p>
                    <strong>CUI:</strong>{" "}
                    {selectedEncargado.cuiencargadoEstudiante}
                  </p>
                  <p>
                    <strong>Nombre:</strong>{" "}
                    {selectedEncargado.nombreencargadoEstudiante}
                  </p>
                  <p>
                    <strong>Apellido:</strong>{" "}
                    {selectedEncargado.apellidoencargadoEstudiante}
                  </p>
                  <p>
                    <strong>Dirección:</strong>{" "}
                    {selectedEncargado.direccionencargadoEstudiante}
                  </p>
                  <p>
                    <strong>Teléfono:</strong>{" "}
                    {selectedEncargado.telefonoencargadoEstudiante}
                  </p>
                  <p>
                    <strong>Correo:</strong>{" "}
                    {selectedEncargado.correencargadoEstudiante}
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

          <Modal isOpen={secondModal} toggle={toggleSecondModal}>
            <ModalHeader toggle={toggleSecondModal}>Asignar</ModalHeader>
            <ModalBody>
              {selectedGradoAsignado && (
                <>
                  <strong>Grados Asignados:</strong>
                  {selectedGradoAsignado.codigoGrado.map((grado, index) => (
                    <p key={index._id}>
                      {grado.nombreGrado} {grado.seccionGrado}
                    </p>
                  ))}
                </>
              )}
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
                    <option key={grado._id} value={grado.codigoGrado}>
                      {grado.nombreGrado} {grado.seccionGrado}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={agregarGradoAEstudiante}>
                Guardar
              </Button>
              <Button color="secondary" onClick={toggleSecondModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={deleteModal} toggle={toggleDeleteModal}>
            <ModalHeader toggle={toggleDeleteModal}>
              Quitar Grado a Estudiante
            </ModalHeader>
            <ModalBody>
              {selectedGradoAsignado && (
                <>
                  <strong>Grados Asignados:</strong>
                  {selectedGradoAsignado.codigoGrado.map((grado, index) => (
                    <p key={index._id}>
                      {grado.nombreGrado} {grado.seccionGrado}
                    </p>
                  ))}
                </>
              )}
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
                    <option key={grado._id} value={grado._id}>
                      {grado.nombreGrado} {grado.seccionGrado}
                    </option>
                  ))}
                </Input>
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={eliminarGradoDeEstudiante}>
                Eliminar
              </Button>
              <Button color="secondary" onClick={toggleDeleteModal}>
                Cancelar
              </Button>
            </ModalFooter>
          </Modal>

          <Modal isOpen={editModal} toggle={toggleEditModal}>
            <ModalHeader toggle={toggleEditModal}>
              Editar Estudiante
            </ModalHeader>
            <ModalBody>
              {selectedEstudiante && (
                <>
                  {/* Campos de edición */}
                  <FormGroup>
                    <Label for="nombreEstudiante">Nombre</Label>
                    <Input
                      type="text-area"
                      id="nombreEstudiante"
                      name="nombreEstudiante"
                      value={editedEstudiante.nombreEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="apellidoEstudiante">Apellido</Label>
                    <Input
                      type="text-area"
                      id="apellidoEstudiante"
                      name="apellidoEstudiante"
                      value={editedEstudiante.apellidoEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="fechanacEstudiante">Fecha de Nacimiento</Label>
                    <Input
                      type="date"
                      id="fechanacEstudiante"
                      name="fechanacEstudiante"
                      value={editedEstudiante.fechanacEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="direccionEstudiante">Dirección</Label>
                    <Input
                      type="text-area"
                      id="direccionEstudiante"
                      name="direccionEstudiante"
                      value={editedEstudiante.direccionEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="nacionalidadEstudiante">Nacionalidad</Label>
                    <Input
                      type="text-area"
                      id="nacionalidadEstudiante"
                      name="nacionalidadEstudiante"
                      value={editedEstudiante.nacionalidadEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="codigomineducEstudiante">Código MINEDUC</Label>
                    <Input
                      type="text-area"
                      id="codigomineducEstudiante"
                      name="codigomineducEstudiante"
                      value={editedEstudiante.codigomineducEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="cuiencargadoEstudiante">CUI Encargado</Label>
                    <Input
                      type="text-area"
                      id="cuiencargadoEstudiante"
                      name="cuiencargadoEstudiante"
                      value={editedEstudiante.cuiencargadoEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="nombreencargadoEstudiante">
                      Nombre Encargado
                    </Label>
                    <Input
                      type="text-area"
                      id="nombreencargadoEstudiante"
                      name="nombreencargadoEstudiante"
                      value={editedEstudiante.nombreencargadoEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="apellidoencargadoEstudiante">
                      Apellido Encargado
                    </Label>
                    <Input
                      type="text-area"
                      id="apellidoencargadoEstudiante"
                      name="apellidoencargadoEstudiante"
                      value={editedEstudiante.apellidoencargadoEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="direccionencargadoEstudiante">
                      Dirección Encargado
                    </Label>
                    <Input
                      type="text-area"
                      id="direccionencargadoEstudiante"
                      name="direccionencargadoEstudiante"
                      value={editedEstudiante.direccionencargadoEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="telefonoencargadoEstudiante">
                      Teléfono Encargado
                    </Label>
                    <Input
                      type="text-area"
                      id="telefonoencargadoEstudiante"
                      name="telefonoencargadoEstudiante"
                      value={editedEstudiante.telefonoencargadoEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="correencargadoEstudiante">
                      Correo Encargado
                    </Label>
                    <Input
                      type="text-area"
                      id="correencargadoEstudiante"
                      name="correencargadoEstudiante"
                      value={editedEstudiante.correencargadoEstudiante}
                      onChange={handleEditInputChange}
                    />
                    <Label for="estadoEstudiante">Estado Estudiante: </Label>
                    <Input
                      type="checkbox" // Cambiar el tipo a "checkbox"
                      id="estadoEstudiante"
                      name="estadoEstudiante"
                      checked={editedEstudiante.estadoEstudiante}
                      onChange={handleEditCheckboxChange}
                    />
                  </FormGroup>
                </>
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={handleEditarEstudiante}>
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

export default VerEstudiante;
