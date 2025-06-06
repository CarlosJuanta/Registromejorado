import React, { useState, useEffect } from "react";
import * as FaIcons from "react-icons/fa";
import { FaRegFilePdf } from "react-icons/fa"; // Importa el icono de PDF
import { PiFilePlus } from "react-icons/pi"; // Importa el icono de añadir archivo
import { FiUserCheck } from "react-icons/fi"; // Importa el icono de usuario
import { FaRegSave } from "react-icons/fa";
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
  ModalFooter,
} from "reactstrap";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Asistencia = () => {
  const [grados, setGrados] = useState([]);
  const [selectedGrado, setSelectedGrado] = useState("");
  const [estudiantes, setEstudiantes] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [modal, setModal] = useState(false);
  const [selectedEstudianteId, setSelectedEstudianteId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [descripcion, setDescripcion] = useState("");

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

  const handleAsistenciaChange = (estudianteId, checked) => {
    const updatedAsistencias = [...asistencias];
    const index = updatedAsistencias.findIndex(
      (asistencia) => asistencia.estudiante === estudianteId
    );

    if (index !== -1) {
      updatedAsistencias[index].estado = checked;
    } else {
      updatedAsistencias.push({
        estudiante: estudianteId,
        estado: checked,
        fecha: obtenerFechaSistema(),
      });
    }

    setAsistencias(updatedAsistencias);
  };

  // Función para obtener la fecha en formato día-mes-año
  const obtenerFechaSistemaheader = () => {
    const fechaActual = new Date();
    const dia = fechaActual.getDate().toString().padStart(2, "0"); // Día con dos dígitos
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, "0"); // Mes con dos dígitos
    const año = fechaActual.getFullYear();
    return `${dia}-${mes}-${año}`;
  };
  const obtenerFechaSistema = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const guardarAsistencias = async () => {
    // Pregunta al usuario si realmente quiere guardar la asistencia

    const confirmarGuardar = window.confirm(
      "¿Estás seguro de que quieres guardar la asistencia?"
    );

    if (!confirmarGuardar) {
      return;
    }
    try {
      const totalRegistros = Object.keys(asistencias).length; // Total de registros
      let registrosProcesados = 0; // Contador de registros procesados

      for (const asistencia of asistencias) {
        const idEstudiante = asistencia.estudiante;
        const { estado, fecha } = asistencia;

        const response = await fetch(
          `${API_URL}/estudiante/agregarAsistencia/${idEstudiante}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ estado, fecha }),
          }
        );

        if (response.status === 200) {
          registrosProcesados++;

          if (registrosProcesados === totalRegistros) {
            alert("Registro Exitoso");
          }
        } else {
          console.log(
            "Error al guardar la asistencia para el estudiante:",
            idEstudiante
          );
        }
      }
    } catch (error) {
      console.error("Hubo un error al guardar las asistencias:", error);
    }
  };

  const generarPDF = () => {
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
    doc.text(`Fecha: ${obtenerFechaSistemaheader()}`, 10, 40);
    doc.text("Asistencia", 10, 45);
    const headers = ["CUI", "Nombre", "Apellido", "Asistencia"];
    const data = estudiantes.map((estudiante) => {
      const asistencia = asistencias.find(
        (asis) => asis.estudiante === estudiante._id
      );
      const asistenciaTexto = asistencia
        ? asistencia.estado
          ? "Presente"
          : "Ausente"
        : "Ausente";

      return [
        estudiante.cuiEstudiante,
        estudiante.nombreEstudiante,
        estudiante.apellidoEstudiante,
        asistenciaTexto,
      ];
    });

    doc.autoTable({
      head: [headers],
      body: data,
      startY: 50,
      theme: "grid",
      styles: {
        font: "times",
        fontSize: 12,
      },
    });

    doc.save("reporte_asistencia.pdf");
  };

  const toggleModal = (estudianteId) => {
    setSelectedEstudianteId(estudianteId);
    setModal(!modal);
  };

  const registrarFalta = async () => {
    try {
      const idEstudiante = selectedEstudianteId;
      const data = { motivo, descripcion };

      const response = await fetch(
        `${API_URL}/estudiante/agregarReporte/${idEstudiante}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (response.status === 200) {
        setRegistroExitoso(true);
        setModal(false);
        setMotivo("");
        setDescripcion("");
      } else {
        console.log(
          "Error al registrar el reporte para el estudiante:",
          idEstudiante
        );
      }
    } catch (error) {
      console.error("Hubo un error al registrar el reporte:", error);
    }
  };

  useEffect(() => {
    cargarGrados();
  }, []);

  useEffect(() => {
    cargarEstudiantesPorGrado();
  }, [selectedGrado]);

  return (
    <>
      <div className="d-flex flex-column align-items-center mt-3 mb-3">
        <span>
          <FiUserCheck
            size={50}
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
          Nuevo Registro Asistencia
        </h5>
      </div>
      <div className="d-flex flex-column flex-md-row p-3 gap-4 justify-content-center align-items-center">
        <div>
          <Button
            onClick={guardarAsistencias}
            style={{
              backgroundColor: "rgb(55 153 76)",
              boxShadow: "0 1px 5px 0#6d5e5e", // Sombra
            }}
          >
            Guardar Asistencia <FaRegSave size={25} />
          </Button>
        </div>
      </div>

      <hr
        className="mb-3"
        style={{
          marginLeft: "90px",
          marginRight: "90px",
          border: "0",
          height: "2px", // Más gruesa
          background: "rgba(245, 237, 237, 0.9)", // Gris translúcido
          filter: "blur(0.2px) drop-shadow(0 0 7px #fff)",
          borderRadius: "4px",
        }}
      />

      <div className="d-flex flex-column flex-md-row pe-5 ps-5 pb-4 gap-4 justify-content-center align-items-center">
        <Input
          type="date"
          placeholder="Fecha"
          value={obtenerFechaSistema()}
          readOnly
          className="w-100"
        />

        <Input
          placeholder="Seleccionar Grado"
          type="select"
          value={selectedGrado}
          onChange={(e) => setSelectedGrado(e.target.value)}
          className="w-100"
        >
          <option value="">Seleccione un Grado</option>
          {grados.map((grado) => (
            <option key={grado._id} value={grado.codigoGrado}>
              {grado.nombreGrado} {grado.seccionGrado}
            </option>
          ))}
        </Input>

        <Button
          style={{
            backgroundColor: "rgb(36 101 147)",
            boxShadow: "0 1px 2px 0#6d5e5e", // Sombra
            filter: "blur(0.1px) drop-shadow(0 0 6px#b6594d)",
          }} // Un poco de blur y resplandor}}
          onClick={generarPDF}
          className="w-100"
        >
          Guardar PDF {""}
          <FaRegFilePdf size={25} />
        </Button>
      </div>

      {registroExitoso && (
        <div className="alert alert-success" role="alert">
          Registro exitoso.
        </div>
      )}

      <div className="px-5 rounded-4" style={{}}>
        <div
          style={{
            maxHeight: "75vh",
            overflowY: "auto",
            borderRadius: "1rem",
          }}
        >
          <table
            className="table table-light border table-hover table-sm rounded-2 shadow align-middle font-monospace"
            style={{ borderRadius: "1rem" }}
          >
            <thead className="table-dark table text-center shadow sticky-top">
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Nombre</th>
                <th scope="col">Apellido</th>
                <th scope="col">Grado</th>
                <th scope="col">Asistencia</th>
                <th scope="col " style={{ width: "200px" }}>
                  Reporte
                </th>
              </tr>
            </thead>
            <tbody className="table text-center ">
              {estudiantes.map((estudiante) => (
                <tr key={estudiante._id}>
                  <td>{estudiantes.indexOf(estudiante) + 1}</td>

                  <td>{estudiante.nombreEstudiante}</td>
                  <td>{estudiante.apellidoEstudiante}</td>
                  <td>{estudiante.codigoGrado[0].nombreGrado}</td>
                  <td>
                    <input
                      type="checkbox"
                      checked={asistencias.some(
                        (asistencia) =>
                          asistencia.estudiante === estudiante._id &&
                          asistencia.estado
                      )}
                      onChange={(e) =>
                        handleAsistenciaChange(estudiante._id, e.target.checked)
                      }
                    />
                  </td>
                  <td>
                    <a
                      href="#"
                      className="  me-2 d-flex flex-column align-items-center mt-2 mb-2"
                      style={{ textDecoration: "none" }}
                      title="Ver"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleModal(estudiante._id);
                      }}
                    >
                      <FaIcons.FaPenAlt size={25} color="#bd1d1d" />
                      <span
                        style={{
                          fontSize: "10px",
                          textDecoration: "none",
                          color: "black",
                        }}
                      >
                        Reportar Falta
                      </span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para registrar falta */}
      <Modal isOpen={modal} toggle={() => toggleModal("")}>
        <ModalHeader toggle={() => toggleModal("")}>
          Registrar Falta
        </ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <label htmlFor="motivo" className="form-label">
              Motivo
            </label>
            <input
              type="text"
              className="form-control"
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              className="form-control"
              id="descripcion"
              rows="3"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            ></textarea>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={registrarFalta}>
            Registrar
          </Button>
          <Button color="secondary" onClick={() => toggleModal("")}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Asistencia;
