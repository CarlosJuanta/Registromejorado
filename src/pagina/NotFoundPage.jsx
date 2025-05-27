import React from "react";
import { Container, Row, Col } from "reactstrap";

const NotFound = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="display-4">Página no encontrada</h1>
          <p>Lo sentimos, la página que estás buscando no existe.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
