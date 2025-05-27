import React, { useState, useEffect } from "react";
import API_URL from "../Configure";
import { useParams } from "react-router-dom";
import { FormGroup, Label, Input, Col, Row, Button, Form } from "reactstrap";

const EncargadoInfo = () => {
  const { id } = useParams();
  const [encargadoInfo, setEncargadoInfo] = useState({});
  const [loading, setLoading] = useState(true);

  // Realiza una solicitud para obtener la información del encargado por su ID
  const fetchEncargadoInfo = async () => {
    try {
      // Reemplaza la URL con la ruta correcta para obtener la información del encargado
      const response = await fetch(`${API_URL}/estudiante/get/${id}`);

      const data = await response.json();
      setEncargadoInfo(data.resultado);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEncargadoInfo();
  }, [id]);

  if (loading) {
    return <h1>Cargando...</h1>;
  }

  return (
    <>
      <h3>Información del Encargado</h3>
      <Form className="bg-light p-5">
        <Row>
          <Col md={3}>
            <FormGroup>
              <Label for="cuiencargado">CUI Encargado</Label>
              <Input
                id="cuiencargado"
                name="cuiencargado"
                placeholder="CUI Encargado"
                type="text"
                value={encargadoInfo.cuiencargadoEstudiante}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="nombresencargado">Nombres Encargado</Label>
              <Input
                id="nombresencargado"
                name="nombresencargado"
                placeholder="Nombres Encargado"
                type="text"
                value={encargadoInfo.nombreencargadoEstudiante}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="apellidosencargado">Apellidos Encargado</Label>
              <Input
                id="apellidosencargado"
                name="apellidosencargado"
                placeholder="Apellidos Encargado"
                type="text"
                value={encargadoInfo.apellidoencargadoEstudiante}
                readOnly
              />
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col md={5}>
            <FormGroup>
              <Label for="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                placeholder="Dirección"
                type="text"
                value={encargadoInfo.direccionencargadoEstudiante}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="telefono">Teléfono</Label>
              <Input
                id="telefono"
                name="telefono"
                placeholder="Teléfono"
                type="text"
                value={encargadoInfo.telefonoencargadoEstudiante}
                readOnly
              />
            </FormGroup>
          </Col>
          <Col md={3}>
            <FormGroup>
              <Label for="correo">Correo</Label>
              <Input
                id="correo"
                name="correo"
                placeholder="ejemplo@gmail.com"
                type="text-area"
                value={encargadoInfo.correencargadoEstudiante}
                readOnly
              />
            </FormGroup>
          </Col>
        </Row>

        <Button color="success" disabled>
          Actualizar
        </Button>
      </Form>
    </>
  );
};

export default EncargadoInfo;
