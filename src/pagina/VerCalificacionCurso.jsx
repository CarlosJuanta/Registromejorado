import React from "react";
import { Button } from "reactstrap";
const Calificaciones = () => {
  return (
    <>
      <h4>Calificaciones</h4>
      <div></div>
      <div class="table-responsive p-5">
        <table class="table table-hover table-light table-sm align-middle table-striped">
          <thead class="table-dark table text-center">
            <tr>
              <th scope="col">Código Curso</th>
              <th scope="col">Nombre Curso </th>
              <th scope="col">I unidad</th>
              <th scope="col">II unidad</th>
              <th scope="col">III unidad</th>
              <th scope="col">IV unidad</th>
              <th scope="col">Promedio</th>"
            </tr>
          </thead>
          <tbody class="table text-center">
            <tr>
              <td>123</td>
              <td>Matematicas</td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                  value="90"
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
            </tr>
            <tr>
              <td>123</td>
              <td>Idioma</td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                  value="95"
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
            </tr>
            <tr>
              <td>123</td>
              <td>Cinecias Sociales</td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                  value="80"
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
            </tr>
            <tr>
              <td>123</td>
              <td>Ciencias Naturales</td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                  value="75"
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
            </tr>
            <tr>
              <td>123</td>
              <td>quiche</td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                  value="86"
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
              <td>
                <input
                  type="text-area"
                  style={{ width: "40px", height: "35px" }}
                />
              </td>
            </tr>
          </tbody>
        </table>
        <div>
          <Button color="success" size="lg" block>
            Imprimir
          </Button>
        </div>
      </div>
    </>
  );
};

export default Calificaciones;
