import React, { useState } from "react";
import API_URL from "../Configure";
import { FormGroup, Label, Input, Col, Row, Button } from "reactstrap";

const Docente = () => {
  const [cuidocente, setCuidocente] = useState("");
  const [nombredocente, setNombredocente] = useState("");
  const [apellidosdocente, setApellidosdocente] = useState("");
  const [telefonodocente, setTelefonodocente] = useState("");
  const [correodocente, setCorreodocente] = useState("");
  const [direcciondocente, setDirecciondocente] = useState("");
  const [nacionalidaddocente, setNacionalidaddocente] = useState("");
  const [rol, setRol] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      const data = {
        cuiDocente: cuidocente,
        nombreDocente: nombredocente,
        apellidoDocente: apellidosdocente,
        telefonoDocente: telefonodocente,
        correoDocente: correodocente,
        direccionDocente: direcciondocente,
        nacionalidadDocente: nacionalidaddocente,
        rol: rol,
        username: username,
        password: password,
      };

      const response = await fetch(`${API_URL}/docente/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.status === 200) {
        alert("Docente Registrado");
        //Limpia el formulario despúes de registrar
        setCuidocente("");
        setNombredocente("");
        setApellidosdocente("");
        setTelefonodocente("");
        setCorreodocente("");
        setDirecciondocente("");
        setNacionalidaddocente("");
        setRol("");
        setUsername("");
        setPassword("");
      } else {
        alert("Error al registrar Docente");
      }
    } catch (error) {
      console.log(error);
      alert("Error al registrar docente");
    }
  };

  return (
    <>
      <h3 className="text-center pt-2 fw-bold">
        Formulario Registro Nuevo Docente
      </h3>
      <div
        className="p-5 m-5 rounded-4 shadow"
        style={{ backgroundColor: "rgba(210, 214, 218, 0.4)" }}
      >
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="cuidocente">CUI Docente</Label>
              <Input
                placeholder="CUI"
                type="text-area"
                onChange={(e) => {
                  // Utiliza una expresión regular para permitir solo números
                  const inputValue = e.target.value.replace(/\D/g, ""); // Elimina todo lo que no sea número
                  if (inputValue.length <= 13) {
                    setCuidocente(inputValue);
                  }
                }}
                value={cuidocente}
                maxLength={13}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="nombresdocente">Nombres</Label>
              <Input
                placeholder="Nombres Docente"
                type="text-area"
                onChange={(e) => setNombredocente(e.target.value)}
                value={nombredocente}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="apellidosdocente">Apellidos</Label>
              <Input
                placeholder="Apellidos Docente"
                type="text-area"
                onChange={(e) => setApellidosdocente(e.target.value)}
                value={apellidosdocente}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="telefonodocente">Telefono</Label>
              <Input
                id="telefonodocente"
                name="telefonodocente"
                placeholder="Telefono Docente"
                type="text-area"
                onChange={(e) => setTelefonodocente(e.target.value)}
                value={telefonodocente}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="correodocente">Correo</Label>
              <Input
                placeholder="ej. correo@gmail.com"
                type="email"
                onChange={(e) => setCorreodocente(e.target.value)}
                value={correodocente}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="direcciondocente">Dirección</Label>
              <Input
                placeholder="Dirección"
                type="text-area"
                onChange={(e) => setDirecciondocente(e.target.value)}
                value={direcciondocente}
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="nacionalidaddocente">Nacionalidad</Label>
              <Input
                id="nacionalidaddocente"
                name="nacionalidaddocente"
                placeholder="Nacionalidad Docente"
                type="text-area"
                onChange={(e) => setNacionalidaddocente(e.target.value)}
                value={nacionalidaddocente}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="rol">Rol</Label>
              <Input
                type="select"
                onChange={(e) => setRol(e.target.value)}
                value={rol}
              >
                <option value="">Seleccione un Rol</option>
                <option value="admin">Administrador</option>
                <option value="docente">Docente</option>
              </Input>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="username">Usuario</Label>
              <Input
                type="text-area"
                name="username"
                id="username"
                placeholder="Username"
                onChange={(e) => setUsername(e.target.value)}
                value={username}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup>
              <Label for="password">Contraseña</Label>
              <Input
                type="text-area"
                name="password"
                id="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col className="text-center pt-3">
            <Button className="w-50" color="success" onClick={handleSubmit}>
              Registrar Docente
            </Button>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Docente;
