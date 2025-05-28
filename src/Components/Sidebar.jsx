import React from "react";
import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "../Styles/style.css";

const Sidebar = ({ open, onClose }) => {
  return (
    <div className={`sidebarprincipal${open ? " open" : ""}`}>
      <ul>
        <li>
          <NavLink to="/login" className="rounded py-2 w-100 d-inline-block px-2 linky" onClick={onClose}>
            <FaIcons.FaUser className="me-2" />
            Iniciar Sesión
          </NavLink>
        </li>
        <li>
          <NavLink to="/inicio" className="rounded py-2 w-100 d-inline-block px-2 linky" onClick={onClose}>
            <FaIcons.FaUniversity className="me-2" />
            Nosotros
          </NavLink>
        </li>
        <li>
          <NavLink to="/verestudiante" className="rounded py-2 w-100 d-inline-block px-2 linky" onClick={onClose}>
            <FaIcons.FaUserGraduate className="me-2" />
            Estudiante
          </NavLink>
        </li>
        <li>
          <NavLink to="/verdocente" className="rounded py-2 w-100 d-inline-block px-2 linky" onClick={onClose}>
            <FaIcons.FaUserTie className="me-2" />
            Docente
          </NavLink>
        </li>
        <li>
          <NavLink to="/vergrado" className="rounded py-2 w-100 d-inline-block px-2 linky" onClick={onClose}>
            <FaIcons.FaUniversity className="me-2" />
            Grado
          </NavLink>
        </li>
        <li>
          <NavLink to="/curso" className="rounded py-2 w-100 d-inline-block px-2 linky" onClick={onClose}>
            <FaIcons.FaWallet className="me-2" />
            Curso
          </NavLink>
        </li>
        <li>
          <NavLink to="/verasistencia" className="rounded py-2 w-100 d-inline-block px-2 linky" onClick={onClose}>
            <FaIcons.FaUserEdit className="me-2" />
            Asistencia
          </NavLink>
        </li>
        <li>
          <NavLink to="/calificaciones" className="rounded py-2 w-100 d-inline-block px-2 linky" onClick={onClose}>
            <FaIcons.FaPencilAlt className="me-2" />
            Calificaciones
          </NavLink>
        </li> 
        <li>
          <button className="btn rounded py-5" onClick={onClose}>
            <FaIcons.FaSignOutAlt className="me-1" />
            Cerrar Sesión
          </button>
        </li>
      </ul> 
      
    </div>
  );
};

export default Sidebar;