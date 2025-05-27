import React from "react";
import { Button } from "reactstrap";
const VerFalta = () => {
  return (
    <>
      <h4>Historial Llamados de Atención</h4>
      <Button className="p-2">Imprimir</Button>
      <div class="table-responsive p-5">
        <table class="table table-hover table-light table-sm align-middle table-striped">
          <thead class="table-dark table text-center">
            <tr>
              <th scope="col">CUI</th>
              <th scope="col">Nombre </th>
              <th scope="col">Apellido</th>
              <th scope="col">Fecha</th>
              <th scope="col">Motivo</th>
              <th scope="col">Descripción</th>
            </tr>
          </thead>
          <tbody class="table text-center">
            <tr>
              <th scope="row">12345678</th>
              <td>Pedro</td>
              <td>De alvarado </td>
              <td>24/08/2023</td>
              <td>Falta de respeto</td>
              <td>Insulto a su compañero de clase diciendole Otaku </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default VerFalta;
