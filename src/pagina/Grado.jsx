import React, { useState, useEffect } from "react";
import API_URL from "../Configure";
import { FormGroup, Label, Input, Col, Row, Button } from "reactstrap";

const Grado = () => {
  const [codigogrado, setCodigogrado] = useState("");
  const [nombregrado, setNombregrado] = useState("");
  const [descripciongrado, setDescripciongrado] = useState("");
  const [secciongrado, setSecciongrado] = useState("");
  const [cuidocente, setCuidocente] = useState("");
  const [docentes, setDocentes] = useState([]); // Estado para almacenar la lista de docentes

  const handleSubmit = async (e) => {
    try {
      const data = {
        codigoGrado: codigogrado,
        nombreGrado: nombregrado,
        descripcionGrado: descripciongrado,
        seccionGrado: secciongrado,
        cuiDocente: cuidocente,
      };

      const response = await fetch(`${API_URL}/grado/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        alert("Grado Registrado");
        // Limpia el formulario después de registrar
        setCodigogrado("");
        setNombregrado("");
        setDescripciongrado("");
        setSecciongrado("");
        setCuidocente("");
      } else {
        alert("Error al registrar Grado");
      }
    } catch (error) {
      console.log(error);
      alert("Error al registrar Grado");
    }
  };

  useEffect(() => {
    // Obtener la lista de docentes al cargar el componente
    const getDocentes = async () => {
      try {
        const response = await fetch(`${API_URL}/docente/getall`);
        const data = await response.json();
        // Almacena la lista de docentes en el estado docentes
        setDocentes(data.resultado);
      } catch (error) {
        console.log(error);
      }
    };

    getDocentes();
  }, []);

  return (
    <>
      <h3 className="text-center pt-2 fw-bold">Formulario Crear Grado</h3>
      <div
        className="p-5 m-5 rounded-4 shadow"
        style={{ backgroundColor: "rgba(210, 214, 218, 0.4)" }}
      >
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="codigogrado">Código Grado</Label>
              <Input
                placeholder="Código Grado"
                type="text-area"
                onChange={(e) => setCodigogrado(e.target.value)}
                value={codigogrado}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="Nombre Grado">Nombre Grado</Label>
              <Input
                type="select"
                onChange={(e) => setNombregrado(e.target.value)}
                value={nombregrado}
              >
                <option value="">Selecciona un grado</option>
                <option value="PARVULOS">PÁRVULOS</option>
                <option value="PREPARATORIA">PREPARATORIA</option>
                <option value="PRIMER GRADO">PRIMER GRADO</option>
                <option value="SEGUNDO GRADO">SEGUNDO GRADO</option>
                <option value="TERCER GRADO">TERCER GRADO</option>
                <option value="CUARTO GRADO">CUARTO GRADO</option>
                <option value="QUINTO GRADO">QUINTO GRADO</option>
                <option value="SEXTO GRADO">SEXTO GRADO</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="descripciongrado">Descripción</Label>
              <Input
                placeholder="Descripción"
                type="textarea"
                onChange={(e) => setDescripciongrado(e.target.value)}
                value={descripciongrado}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="seccion">Sección</Label>
              <Input
                type="select"
                name="seccion"
                id="seccion"
                onChange={(e) => setSecciongrado(e.target.value)}
                value={secciongrado}
              >
                <option value="">Seleccionar sección</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="cuidocenteasignado">Nombre docente asignado</Label>
              <Input
                type="select"
                onChange={(e) => setCuidocente(e.target.value)}
                value={cuidocente}
              >
                <option value="">Selecciona un docente</option>
                {docentes.map((docente) => (
                  <option key={docente.cuiDocente} value={docente.cuiDocente}>
                    {docente.nombreDocente} {docente.apellidoDocente}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-center col-12 pt-3 ">
            <Button className="w-50" color="success" onClick={handleSubmit}>
              Registrar Grado
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Grado;
