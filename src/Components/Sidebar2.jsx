import React from "react";
import { NavLink } from "react-router-dom";
import * as FaIcons from "react-icons/fa";

const Sidebar = () => {
  return (
    <div className="sidebar bg-light " expand=" sidebar md sm lg">
      <ul>
        <li>
          <NavLink
            to="/verasistencia"
            className="rounded py-2 w-100 d-inline-block px-2 linky"
          >
            <FaIcons.FaUserEdit className="me-2" />
            Asistencia
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/calificaciones"
            className="rounded py-2 w-100 d-inline-block px-1 linky"
          >
            <FaIcons.FaPencilAlt className="me-2" />
            Calificaciones
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
