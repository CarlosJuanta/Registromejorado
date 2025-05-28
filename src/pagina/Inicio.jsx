import React from "react";
import logo from "../Imagenes/logoescuela.png"; // Importa la imagen
import { Container, Row, Col } from "reactstrap";
import "../Styles/style.css"; // Asegúrate de que la ruta sea correcta


const Inicio = (props) => {
  return (
    <>
      <div className="bg-gradient-custom h-100">  
        
        <div  className=" logoescuela d-flex flex-column justify-content-center align-items-center">  
          <img src={logo}  />
        </div>

          <div className="d-flex  flex-column flex-md-row p-1 p-md-4">
             <div className="d-flex p-5 flex-column justify-content-center align-items-center border-md-end border-2 border-dark">
                 <h5 className="fw-bold " >MISIÓN</h5>
                   <p className="text-md-center fs-6 fs-md-4" >
               Integrar un equipo de profesionales de la educación comprometidos
               con innovaciones metodológicas y actitudinales que permitan la
               formación integral de los estudiantes capaces de desenvolverse en
               cualquier aspecto que la vida les presente.
                   </p>
               </div>
             <div className="d-flex flex-column p-5 justify-content-center align-items-center" >
                  <h5 className="fw-bold" >VISIÓN</h5>
                  <p className="text-md-center fs-6">
                  Ser una institución educativa preocupada en la formación integral
                  de los estudiantes sustentada en principios y valores que le
                  permita el crecimiento individual, familiar y social para el
                  desarrollo del país.
                 </p>
               </div> 
          </div>
      </div>
    
    </>
  );
};

export default Inicio;
