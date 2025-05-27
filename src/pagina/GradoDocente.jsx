import React from "react";
import { Button } from "reactstrap";
const GradoDocente = () => {
  return (
    <>
      <div class="table-responsive p-5">
        <table class="table table-hover table-light table-sm align-middle table-striped">
          <thead class="table-dark">
            <tr>
              <th scope="col">Código Grado</th>
              <th scope="col">Nombre </th>
              <th scope="col">Descripción</th>
              <th scope="col">Sección</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">1</th>
              <td>Primero</td>
              <td>Primero Primaria</td>
              <td>A </td>
            </tr>
          </tbody>
        </table>
        <div className="p-4">
          <Button color="success">Asignar Grado</Button>
        </div>
      </div>
    </>
  );
};

export default GradoDocente;
