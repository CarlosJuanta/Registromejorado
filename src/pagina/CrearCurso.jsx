import React, { useState, useEffect } from "react";
import { FormGroup, Label, Input, Col, Row, Button } from "reactstrap";
import API_URL from "../Configure";

const Curso = () => {
  const [codigoCurso, setCodigoCurso] = useState("");
  const [nombreCurso, setNombreCurso] = useState("");
  const [descripcionCurso, setDescripcionCurso] = useState("");
  const [grados, setGrados] = useState([]); // Estado para almacenar la lista de grados
  const [codigoGradoSeleccionado, setCodigoGradoSeleccionado] = useState("");

  const handleSubmit = async (e) => {
    try {
      const data = {
        codigoCurso: codigoCurso,
        nombreCurso: nombreCurso,
        descripcionCurso: descripcionCurso,
        codigoGrado: codigoGradoSeleccionado,
      };

      const response = await fetch(`${API_URL}/curso/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.status === 200) {
        alert("Curso Registrado");
        // Limpia el formulario después de registrar
        setCodigoCurso("");
        setNombreCurso("");
        setDescripcionCurso("");
        setCodigoGradoSeleccionado("");
      } else {
        alert("Error al registrar Curso");
      }
    } catch (error) {
      console.log(error);
      alert("Error al registrar Curso");
    }
  };

  useEffect(() => {
    // Obtener la lista de grados al cargar el componente
    const getGrados = async () => {
      try {
        const response = await fetch(`${API_URL}/grado/getall`);
        const data = await response.json();
        // Almacena la lista de grados en el estado grados
        setGrados(data.resultado);
      } catch (error) {
        console.log(error);
      }
    };

    getGrados();
  }, []);

  return (
    <>
      <h3 className="text-center fw-bold pt-2">Formulario Crear Curso</h3>
      <div
        className="p-5 m-5 rounded-4 shadow "
        style={{ backgroundColor: "rgba(210, 214, 218, 0.4)" }}
      >
        <Row className="justify-content-between">
          <Col md={3}>
            <FormGroup>
              <Label for="codigoCurso">Código Curso</Label>
              <Input
                placeholder="Código Curso"
                type="text-area"
                onChange={(e) => setCodigoCurso(e.target.value)}
                value={codigoCurso}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="nombreCurso">Nombre Curso</Label>
              <Input
                placeholder="Nombre Curso"
                type="text-area"
                onChange={(e) => setNombreCurso(e.target.value)}
                value={nombreCurso}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="descripcionCurso">Descripción</Label>
              <Input
                placeholder="Descripción"
                type="textarea"
                onChange={(e) => setDescripcionCurso(e.target.value)}
                value={descripcionCurso}
              />
            </FormGroup>
          </Col>
        </Row>
        <hr className="my-3" /> {/* Línea divisoria aquí */}
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="codigoGrado">Seleccionar Grado</Label>
              <Input
                type="select"
                onChange={(e) => setCodigoGradoSeleccionado(e.target.value)}
                value={codigoGradoSeleccionado}
              >
                <option value="">Selecciona un grado</option>
                {grados.map((grado) => (
                  <option key={grado.codigoGrado} value={grado.codigoGrado}>
                    {grado.nombreGrado} {grado.seccionGrado}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-center pt-3">
            <Button className="w-50" color="success" onClick={handleSubmit}>
              Registrar Curso
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Curso;
