import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import API_URL from "../Configure";
import logo from "../Imagenes/logoescuela.png"; // Importa la imagen
import {
  Button,
  Input,
  Col,
  Row,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
} from "reactstrap";
import jsPDF from "jspdf";

const Asistencia = () => {
  const [grados, setGrados] = useState([]);
  const [selectedGrado, setSelectedGrado] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedEstudiante, setSelectedEstudiante] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  useEffect(() => {
    cargarGrados();
  }, []);

  useEffect(() => {
    cargarEstudiantesPorGrado();
  }, [selectedGrado]);

  const abrirModal = (estudiante) => {
    setSelectedEstudiante(estudiante);
    setModalOpen(true);
  };
  // Función para obtener la fecha en formato día-mes-año
  const obtenerFechaSistema = () => {
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, "0"); // Día con dos dígitos
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0"); // Mes con dos dígitos
    const año = fechaActual.getFullYear();
    return `${dia}-${mes}-${año}`;
  };

  const generarReportePDF = () => {
    // Crear un nuevo documento jsPDF
    const doc = new jsPDF();

    // Agrega el encabezado
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
    doc.text(
      `Grado: ${
        grados.find((grado) => grado.codigoGrado === selectedGrado)?.nombreGrado
      }`,
      10,
      25
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
      30
    );
    // Agregar la sección del grado
    doc.text(
      `Sección: ${
        grados.find((grado) => grado.codigoGrado === selectedGrado)
          ?.seccionGrado
      }`,
      70,
      25
    );
    // En tu código existente:
    doc.text(`Fecha: ${obtenerFechaSistema()}`, 10, 40);
    doc.text("Asistencia", 10, 45);

    // Contenido del reporte
    const asistenciasPorEstudiante = estudiantes.map((estudiante) => {
      const totalAsistencias = estudiante.asistencias.filter(
        (asistencia) => asistencia.estado
      ).length;
      const porcentajeAsistencias =
        ((totalAsistencias / 55) * 100).toFixed(2) + "%";
      return [
        estudiante.apellidoEstudiante + ", " + estudiante.nombreEstudiante,
        totalAsistencias + " asistencias",
        porcentajeAsistencias,
      ];
    });

    // Generar la tabla
    doc.autoTable({
      head: [["Estudiante", "Total Asistencias", "Porcentaje"]],
      body: asistenciasPorEstudiante,
      startY: 50,
      theme: "grid",
    });

    // Guardar el archivo con un nombre específico
    doc.save("reporte_asistencias.pdf");
  };

  return (
    <>
      <h4 className="p-4 text-center  fs-2 ">Asistencia</h4>
      <div>
        <div className="d-flex flex-column flex-md-row p-3 gap-4 justify-content-center align-items-center">
          <div>
            <NavLink to="/asistencia">
              <Button color="warning">Registrar Nueva Asistencia</Button>
            </NavLink>
          </div>
          <div>
            <Button color="primary " onClick={generarReportePDF}>
              Generar Reporte PDF
            </Button>
          </div>
        </div>
        <div className="d-flex flex-column flex-md-row pe-5 ps-5 gap-4 justify-content-center align-items-center">
          <Input
            type="date"
            placeholder="Fecha"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />

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
        </div>
      </div>

      <div className="table-responsive p-5">
        <table className="table table-light table-sm align-middle">
          <thead className="table-dark table text-center">
            <tr className="">
              <th scope="col">CUI</th>
              <th scope="col">Nombre</th>
              <th scope="col">Apellido</th>
              <th scope="col">Grado</th>
              <th scope="col">Asistencias</th>
              <th scope="col">Total Asistencias</th>
              <th scope="col">Porcentaje</th>
              <th scope="col">Llamados de Atención</th>
            </tr>
          </thead>
          <tbody className="table text-center table-hover">
            {estudiantes.map((estudiante) => {
              const totalAsistencias = estudiante.asistencias.filter(
                (asistencia) => asistencia.estado
              ).length;

              return (
                <tr key={estudiante._id}>
                  <td>{estudiante.cuiEstudiante}</td>
                  <td>{estudiante.nombreEstudiante}</td>
                  <td>{estudiante.apellidoEstudiante}</td>
                  <td>{estudiante.codigoGrado[0].nombreGrado}</td>
                  <td>
                    {selectedDate && (
                      <>
                        {
                          estudiante.asistencias.filter(
                            (asistencia) =>
                              asistencia.fecha === selectedDate &&
                              asistencia.estado
                          ).length
                        }
                      </>
                    )}
                  </td>
                  <td>{totalAsistencias}</td>
                  <td>{((totalAsistencias / 55) * 100).toFixed(2)}%</td>
                  <td>
                    <Button
                      color="primary"
                      onClick={() => abrirModal(estudiante)}
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
        <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
          Reportes de{" "}
          {selectedEstudiante && selectedEstudiante.nombreEstudiante}
        </ModalHeader>
        <ModalBody>
          <Table>
            <thead>
              <tr>
                <th>Motivo</th>
                <th>Descripción</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {selectedEstudiante &&
                selectedEstudiante.reportes.map((reporte) => (
                  <tr key={reporte._id}>
                    <td>{reporte.motivo}</td>
                    <td>{reporte.descripcion}</td>
                    <td>
                      {new Date(reporte.fecha).toLocaleDateString("es-ES")}
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </ModalBody>
      </Modal>
    </>
  );
};

export default Asistencia;
