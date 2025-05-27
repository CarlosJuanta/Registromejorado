import React, { useState, useEffect } from "react";
import API_URL from "../Configure";
import { FormGroup, Label, Input, Col, Row, Button } from "reactstrap";

const Estudiante = () => {
  const [cuiestudiante, setCuiestudiante] = useState("");
  const [nombreestudiante, setNombresestudiante] = useState("");
  const [apellidoestudiante, setApellidosestudiante] = useState("");
  const [fechanacestudiante, setFechanacestudiante] = useState("");
  const [direccionestudiante, setDireccionestudiante] = useState("");
  const [nacionalidadestudiante, setNacionalidadestudiante] = useState("");
  const [codigomineducestudiante, setCodigomineducestudiante] = useState("");
  const [cuiencargadoestudiante, setCuiencargadoestudiante] = useState("");
  const [nombreencargadoestudiante, setNombreencargadoestudiante] =
    useState("");
  const [apellidoencargadoestudiante, setApellidoencargadoestudiante] =
    useState("");
  const [direccionencargadoestudiante, setDireccionencargadoestudiante] =
    useState("");
  const [telefonoencargadoestudiante, setTelefonoencargadoestudiante] =
    useState("");
  const [correencargadoestudiante, setCorreencargadoestudiante] = useState("");
  const [grados, setGrados] = useState([]); // Estado para almacenar la lista de grados
  const [codigoGradoSeleccionado, setCodigoGradoSeleccionado] = useState("");

  const handleSubmit = async (e) => {
    try {
      const data = {
        cuiEstudiante: cuiestudiante,
        nombreEstudiante: nombreestudiante,
        apellidoEstudiante: apellidoestudiante,
        fechanacEstudiante: fechanacestudiante,
        direccionEstudiante: direccionestudiante,
        nacionalidadEstudiante: nacionalidadestudiante,
        codigomineducEstudiante: codigomineducestudiante,
        cuiencargadoEstudiante: cuiencargadoestudiante,
        nombreencargadoEstudiante: nombreencargadoestudiante,
        apellidoencargadoEstudiante: apellidoencargadoestudiante,
        direccionencargadoEstudiante: direccionencargadoestudiante,
        telefonoencargadoEstudiante: telefonoencargadoestudiante,
        correencargadoEstudiante: correencargadoestudiante,
        codigoGrado: codigoGradoSeleccionado,
      };

      const response = await fetch(`${API_URL}/estudiante/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        alert("Estudiante Registrado");
        // Limpia el formulario después de registrar
        setCuiestudiante("");
        setNombresestudiante("");
        setApellidosestudiante("");
        setFechanacestudiante("");
        setDireccionestudiante("");
        setNacionalidadestudiante("");
        setCodigomineducestudiante("");
        setCuiencargadoestudiante("");
        setNombreencargadoestudiante("");
        setApellidoencargadoestudiante("");
        setDireccionencargadoestudiante("");
        setTelefonoencargadoestudiante("");
        setCorreencargadoestudiante("");
        setCodigoGradoSeleccionado("");
      } else {
        alert("Error al registrar Estudiante");
      }
    } catch (error) {
      console.log(error);
      alert("Error al registrar Estudiante");
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
      <h3>Formulario Registro Nuevo Estudiante</h3>
      <div className="bg-light p-5" fluid="lg">
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="cui">CUI</Label>
              <Input
                placeholder="CUI"
                type="text-area"
                onChange={(e) => {
                  // Utiliza una expresión regular para permitir solo números
                  const inputValue = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea número
                  if (inputValue.length <= 13) {
                    setCuiestudiante(inputValue);
                  }
                }}
                value={cuiestudiante}
                maxLength={13}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="nombres">Nombres</Label>
              <Input
                placeholder="Nombres"
                type="text-area"
                onChange={(e) => setNombresestudiante(e.target.value)}
                value={nombreestudiante}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="apellidos">Apellidos</Label>
              <Input
                placeholder="Apellidos"
                type="text-area"
                onChange={(e) => setApellidosestudiante(e.target.value)}
                value={apellidoestudiante}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="fechaNac">Fecha Nacimiento</Label>
              <Input
                placeholder="Fecha Nacimiento"
                type="date"
                onChange={(e) => setFechanacestudiante(e.target.value)}
                value={fechanacestudiante}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="direccion">Direccion</Label>
              <Input
                placeholder="Dirección"
                type="text-area"
                onChange={(e) => setDireccionestudiante(e.target.value)}
                value={direccionestudiante}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="nacionalidad">Nacionalidad</Label>
              <Input
                placeholder="Nacionalidad"
                type="text-area"
                onChange={(e) => setNacionalidadestudiante(e.target.value)}
                value={nacionalidadestudiante}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="codigomineduc">Código Mineduc</Label>
              <Input
                placeholder="Código Mineduc"
                type="text-area"
                onChange={(e) => setCodigomineducestudiante(e.target.value)}
                value={codigomineducestudiante}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="cuiencargado">CUI Encargado</Label>
              <Input
                placeholder="CUI"
                type="text-area"
                onChange={(e) => {
                  // Utiliza una expresión regular para permitir solo números
                  const inputValue = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea número
                  if (inputValue.length <= 13) {
                    setCuiencargadoestudiante(inputValue);
                  }
                }}
                value={cuiencargadoestudiante}
                maxLength={13}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="nombresencargado">Nombres Encargado</Label>
              <Input
                placeholder="Nombres Encargado"
                type="text-area"
                onChange={(e) => setNombreencargadoestudiante(e.target.value)}
                value={nombreencargadoestudiante}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="apellidosencargado">Apellidos Encargado</Label>
              <Input
                placeholder="Apellidos Encargado"
                type="text-area"
                onChange={(e) => setApellidoencargadoestudiante(e.target.value)}
                value={apellidoencargadoestudiante}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <FormGroup>
              <Label for="direccion">Dirección</Label>
              <Input
                placeholder="Dirección"
                type="text-area"
                onChange={(e) =>
                  setDireccionencargadoestudiante(e.target.value)
                }
                value={direccionencargadoestudiante}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="telefono">Telefono</Label>
              <Input
                placeholder="telefono"
                type="number"
                onChange={(e) => setTelefonoencargadoestudiante(e.target.value)}
                value={telefonoencargadoestudiante}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="correo">Correo</Label>
              <Input
                placeholder="ejemplo@gmail.com"
                type="email"
                onChange={(e) => setCorreencargadoestudiante(e.target.value)}
                value={correencargadoestudiante}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="grado">Grado</Label>
              <Input
                type="select"
                onChange={(e) => setCodigoGradoSeleccionado(e.target.value)} // Actualiza el código del grado seleccionado
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
        <Button color="success" onClick={handleSubmit}>
          Registrar Estudiante
        </Button>
      </div>
    </>
  );
};

export default Estudiante;
