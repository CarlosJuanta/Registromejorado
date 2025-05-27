import React from "react";
import logo from "../Imagenes/logoescuela.png"; // Importa la imagen
import { Container, Row, Col } from "reactstrap";

const Inicio = (props) => {
  return (
    <>
      <div class="card-group" style={{ height: "100vh" }}>
        <div class="card border-white">
          <div class="card-body">
            <h5 class="card-title text-center">MISIÓN</h5>
            <p
              class="card text-center border-white"
              style={{ fontStyle: "italic" }}
            >
              Integrar un equipo de profesionales de la educación comprometidos
              con innovaciones metodológicas y actitudinales que permitan la
              formación integral de los estudiantes capaces de desenvolverse en
              cualquier aspecto que la vida les presente.
            </p>
          </div>
        </div>
        <div class="card border-white">
          <img
            src={logo}
            className="mx-auto d-block img-fluid"
            alt="..."
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              width: "auto",
              height: "auto",
            }}
          />
          <div class="card-body">
            <h5 class="card-title text-center">EDUCACIÓN DE CALIDAD</h5>
          </div>
        </div>
        <div class="card border-white">
          <div class="card-body">
            <h5 class="card-title text-center">VISIÓN</h5>
            <p
              class="card text-center border-white"
              style={{ fontStyle: "italic" }}
            >
              Ser una institución educativa preocupada en la formación integral
              de los estudiantes sustentada en principios y valores que le
              permita el crecimiento individual, familiar y social para el
              desarrollo del país.{" "}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inicio;
