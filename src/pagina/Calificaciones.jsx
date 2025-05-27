import React, { useState, useEffect, useContext } from "react";
import { Contexto } from "../Context/ContextProvider";
import { Navigate, useNavigate } from "react-router-dom";
import logo from "../Imagenes/logoescuela.png"; // Importa la imagen
import API_URL from "../Configure";
import {
  Button,
  Input,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
  ModalFooter,
  Spinner,
} from "reactstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Asistencia = () => {
  const [grados, setGrados] = useState([]);
  const [selectedGrado, setSelectedGrado] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalRegistrarNotasOpen, setModalRegistrarNotasOpen] = useState(false);
  const { usuario } = useContext(Contexto);
  const navigate = useNavigate();
  // Estados para el modal de registro de notas
  const [cursosPorGrado, setCursosPorGrado] = useState([]);

  const [selectedBloque, setSelectedBloque] = useState("1");

  const [loadingCursos, setLoadingCursos] = useState(false); // Estado para indicar la carga de cursos

  // Función para generar un PDF de las calificaciones del estudiante seleccionado
  const generarPDFCalificaciones = () => {
    if (selectedEstudiante) {
      const doc = new jsPDF();

      // Título del PDF
      doc.setFont("times");
      doc.setFontSize(12);
      // Agregar el logo al encabezado
      doc.addImage(logo, "PNG", 150, 8, 40, 30); // Ajusta las coordenadas y dimensiones según tus necesidades
      doc.text('ESCUELA OFICIAL URBANA MIXTA JOSÉ JOAQUÍN PALMA"', 10, 10);
      doc.text(
        "3a. Calle 33A-37 zona 8, Colonia La Democracia, Quetzaltenango",
        10,
        15
      );

      // Nombre y apellidos del estudiante
      const nombreCompleto =
        selectedEstudiante.nombreEstudiante +
        " " +
        selectedEstudiante.apellidoEstudiante;
      doc.text("Nombre: " + nombreCompleto, 10, 30);
      // Agrega el encabezado

      doc.text(
        `Grado: ${
          grados.find((grado) => grado.codigoGrado === selectedGrado)
            ?.nombreGrado
        }`,
        10,
        35
      );
      // Agregar la sección del grado
      doc.text(
        `Sección: ${
          grados.find((grado) => grado.codigoGrado === selectedGrado)
            ?.seccionGrado
        }`,
        80,
        35
      );
      doc.text(
        `Docente: ${
          grados.find((grado) => grado.codigoGrado === selectedGrado)
            ?.cuiDocente[0].nombreDocente
        } ${
          grados.find((grado) => grado.codigoGrado === selectedGrado)
            ?.cuiDocente[0].apellidoDocente
        }`,
        10,
        40
      );

      // Datos de las calificaciones en una tabla
      const calificaciones = selectedEstudiante.notas;
      const data = [];

      // Encabezados de las columnas (incluye "Promedio" al final)
      const columnHeaders = [
        "Curso",
        "Bloque 1",
        "Bloque 2",
        "Bloque 3",
        "Bloque 4",
        "Promedio",
      ];

      calificaciones.forEach((calificacion) => {
        const notas = calificacion.notas.map((nota) => nota.nota);
        const sum = notas.reduce((acc, nota) => acc + nota, 0);
        const promedio = (sum / notas.length).toFixed(); // Calcula el promedio

        const row = [
          calificacion.curso.nombreCurso,
          notas[0], // Nota del "Bloque 1"
          notas[1], // Nota del "Bloque 2"
          notas[2], // Nota del "Bloque 3"
          notas[3], // Nota del "Bloque 4"
          promedio, // Promedio en la posición 4
        ];
        data.push(row);
      });

      // Generar la tabla
      doc.autoTable({
        head: [columnHeaders], // Utiliza los encabezados personalizados
        body: data,
        startY: 50,
      });

      // Guardar el PDF
      doc.save(
        `${selectedEstudiante.nombreEstudiante}_${selectedEstudiante.apellidoEstudiante}_calificaciones.pdf`
      );
    }
  };

  const cargarGrados = async () => {
    try {
      const response = await fetch(`${API_URL}/grado/getall`);
      if (response.status === 200) {
        const data = await response.json();
        setGrados(data.resultado);
      } else {
        console.log("Error al cargar los grados");
      }
    } catch (error) {
      console.error("Hubo un error al cargar los grados:", error);
    }
  };

  const cargarEstudiantesPorGrado = async () => {
    if (!selectedGrado) return;

    try {
      const data = { codigoGrado: selectedGrado };
      const response = await fetch(`${API_URL}/estudiante/getbygrado`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        const data = await response.json();
        setEstudiantes(data.gradosAsignados);
        console.log(data.gradosAsignados);
      } else {
        console.log("Error al cargar los estudiantes asignados al grado");
      }
    } catch (error) {
      console.error(
        "Hubo un error al cargar los estudiantes asignados al grado:",
        error
      );
    }
  };

  const cargarCursosPorGrado = async (codigoGrado) => {
    setLoadingCursos(true); // Indicar que se está cargando
    try {
      const response = await fetch(`${API_URL}/curso/getbygrado`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          codigoGrado,
        }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setCursosPorGrado(data.cursos);
      } else {
        console.log("Error al cargar los cursos por grado");
      }
    } catch (error) {
      console.error("Hubo un error al cargar los cursos por grado:", error);
    } finally {
      setLoadingCursos(false); // Indicar que la carga ha finalizado
    }
  };
  // Nueva función para registrar notas
  const registrarNotas = async () => {
    // Pregunta al usuario si realmente quiere guardar las notas
    const confirmarGuardar = window.confirm(
      "¿Estás seguro de que quieres guardar las notas?"
    );

    if (!confirmarGuardar) {
      return;
    }

    try {
      const totalRegistros = Object.keys(notasPorCurso).length; // Total de registros
      let registrosProcesados = 0; // Contador de registros procesados

      for (const cursoId in notasPorCurso) {
        const nota = notasPorCurso[cursoId];

        const requestBody = {
          cursoId: cursoId,
          bloque: selectedBloque, // Usas el bloque seleccionado
          nota: nota,
        };

        const response = await fetch(
          `${API_URL}/estudiante/notas/${selectedEstudiante._id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );

        if (response.status === 200) {
          registrosProcesados++;

          if (registrosProcesados === totalRegistros) {
            alert("Notas ingresadas con éxito");
            setNotasPorCurso({}); // Reinicia el estado de las notas por curso
            setModalRegistrarNotasOpen(false);
          }
        } else {
          console.log(
            "Error al guardar la nota para el estudiante en el curso:",
            cursoId
          );
        }
      }
    } catch (error) {
      console.error("Hubo un error al guardar las notas:", error);
    }
  };

  const [notasPorCurso, setNotasPorCurso] = useState({});

  const handleChangeNota = (cursoId, nota) => {
    // Actualiza el estado de las notas por curso
    setNotasPorCurso((prevState) => ({
      ...prevState,
      [cursoId]: nota,
    }));
  };

  useEffect(() => {
    cargarGrados();
  }, []);

  useEffect(() => {
    cargarEstudiantesPorGrado();
  }, [selectedGrado]);

  const abrirModal = (estudiante) => {
    setSelectedEstudiante(estudiante);
    cargarCursosPorGrado(selectedGrado); // Cargar cursos usando selectedGrado
    setModalOpen(true);
  };

  // Nueva función para abrir el modal de registro de notas
  const abrirModalRegistrarNotas = (estudiante) => {
    setSelectedEstudiante(estudiante);
    cargarCursosPorGrado(selectedGrado); // Cargar cursos usando selectedGrado
    setModalRegistrarNotasOpen(true);
  };

  if (!usuario) {
    navigate("/login");
  } else if (usuario.rol === "admin" || usuario.rol === "docente") {
    return (
      <>
        <h4>Calificaciones</h4>
        <div className="p-5">
          <Row>
            <Col className="text-end">
              <Input
                placeholder="Seleccionar Grado"
                type="select"
                value={selectedGrado}
                onChange={(e) => setSelectedGrado(e.target.value)}
              >
                <option value="">Seleccionar...</option>
                {grados.map((grado) => (
                  <option key={grado.codigoGrado} value={grado.codigoGrado}>
                    {`${grado.nombreGrado} ${grado.seccionGrado}`}
                  </option>
                ))}
              </Input>
            </Col>
          </Row>
        </div>
        <div className="table-responsive p-4">
          <table className="table table-light table-sm align-middle table-striped">
            <thead className="table-dark table text-center">
              <tr>
                <th scope="col">CUI</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Grado</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody className="table text-center ">
              {estudiantes.map((estudiante, index) => (
                <tr key={estudiante._id}>
                  <td>{estudiante.cuiEstudiante}</td>
                  <td>{estudiante.nombreEstudiante}</td>
                  <td>{estudiante.apellidoEstudiante}</td>
                  <td>{estudiante.codigoGrado[0].nombreGrado}</td>
                  <td>
                    <td>
                      <Button
                        color="success"
                        onClick={() => abrirModal(estudiante)}
                      >
                        Ver
                      </Button>
                    </td>
                    <td>
                      <Button
                        color="warning"
                        onClick={() => abrirModalRegistrarNotas(estudiante)}
                      >
                        Registrar
                      </Button>
                    </td>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal
          isOpen={modalOpen}
          toggle={() => setModalOpen(!modalOpen)}
          size="lg"
        >
          <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
            Calificaciones de{" "}
            {selectedEstudiante &&
              selectedEstudiante.nombreEstudiante +
                " " +
                selectedEstudiante.apellidoEstudiante}{" "}
            {"----------"}
            <img
              src={logo}
              alt="Logo"
              style={{ width: "80px", height: "60px" }}
            />
          </ModalHeader>

          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th>Curso</th>
                  {selectedEstudiante &&
                    selectedEstudiante.notas[0]?.notas.map(
                      (nota, indexNota) => (
                        <th key={indexNota}>{`Bloque ${nota.bloque}`}</th>
                      )
                    )}
                  <th>Promedio</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {selectedEstudiante &&
                  selectedEstudiante.notas.map((notaCurso, indexCurso) => (
                    <tr key={indexCurso}>
                      <td>{notaCurso.curso.nombreCurso}</td>
                      {notaCurso.notas.map((nota, indexNota) => (
                        <td key={indexNota}>{`${nota.nota}`}</td>
                      ))}
                      <td>
                        {(() => {
                          const sum = notaCurso.notas.reduce(
                            (acc, nota) => acc + nota.nota,
                            0
                          );
                          const promedio = sum / notaCurso.notas.length;
                          return promedio.toFixed(2); // Mostrar el promedio con 2 decimales
                        })()}
                      </td>
                      <td>
                        {(() => {
                          const sum = notaCurso.notas.reduce(
                            (acc, nota) => acc + nota.nota,
                            0
                          );
                          const promedio = sum / notaCurso.notas.length;
                          if (promedio >= 80) {
                            return <span className="excellent">Excelente</span>;
                          } else {
                            return (
                              <span className="improve">Necesita mejorar</span>
                            );
                          }
                        })()}
                      </td>
                    </tr>
                  ))}
                <Button color="primary" onClick={generarPDFCalificaciones}>
                  Generar PDF de Calificaciones
                </Button>
              </tbody>
            </Table>
          </ModalBody>
        </Modal>
        <Modal
          isOpen={modalRegistrarNotasOpen}
          toggle={() => setModalRegistrarNotasOpen(!modalRegistrarNotasOpen)}
          size="lg"
        >
          <ModalHeader
            toggle={() => setModalRegistrarNotasOpen(!modalRegistrarNotasOpen)}
          >
            Registrar Notas para{" "}
            {selectedEstudiante && selectedEstudiante.nombreEstudiante}
          </ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th>Curso</th>
                  <th>Nota</th>
                </tr>
              </thead>
              <tbody>
                {cursosPorGrado.map((curso) => (
                  <tr key={curso._id}>
                    <td>{curso.nombreCurso}</td>
                    <td>
                      <Input
                        type="number"
                        placeholder="Nota"
                        value={notasPorCurso[curso._id] || ""}
                        onChange={(e) =>
                          handleChangeNota(curso._id, e.target.value)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>

            <Input
              type="select"
              value={selectedBloque}
              onChange={(e) => setSelectedBloque(e.target.value)}
            >
              <option value="1">Bloque 1</option>
              <option value="2">Bloque 2</option>
              <option value="3">Bloque 3</option>
              <option value="4">Bloque 4</option>
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={() => registrarNotas()}>
              Guardar Notas
            </Button>
            <Button
              color="secondary"
              onClick={() => setModalRegistrarNotasOpen(false)}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </Modal>
        {loadingCursos && <Spinner color="primary" />}{" "}
        {/* Mostrar spinner mientras se cargan los cursos */}
      </>
    );
  } else {
    return <Navigate to="/" />;
  }
};

export default Asistencia;
