import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import * as FaIcons from "react-icons/fa";
import "../Styles/style.css";
import { Contexto } from "../Context/ContextProvider";

const Sidebar = ({ open, onClose }) => {
  const { usuario, setUsuario } = useContext(Contexto);
  const navigate = useNavigate();

  const handleLogout = () => {
    setUsuario({ rol: null });
    navigate("/login");
    if (onClose) onClose();
  };

  // Si el usuario no está autenticado, redirige a login
  if (!usuario || !usuario.rol) {
    return (
      <div className={`sidebarprincipal${open ? " open" : ""}`}>
        <ul>
          <li>
            <NavLink
              to="/login"
              className="rounded py-2 w-100 d-inline-block px-2 linky"
              onClick={onClose}
            >
              <FaIcons.FaUser className="me-2" />
              Iniciar Sesión
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/inicio"
              className="rounded py-2 w-100 d-inline-block px-2 linky"
              onClick={onClose}
            >
              <FaIcons.FaUniversity className="me-2" />
              Nosotros
            </NavLink>
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className={`sidebarprincipal${open ? " open" : ""}`}>
      <ul>
        {/* Solo muestra "Iniciar Sesión" si el usuario es público o no autenticado */}
        {(usuario.rol === "publico" || usuario.rol === null) && (
          <li>
            <NavLink
              to="/login"
              className="rounded py-2 w-100 d-inline-block px-2 linky"
              onClick={onClose}
            >
              <FaIcons.FaUser className="me-2" />
              Iniciar Sesión
            </NavLink>
          </li>
        )}

        {/* Todos los roles pueden ver "Nosotros" */}
        {(usuario.rol === "admin" ||
          usuario.rol === "docente" ||
          usuario.rol === "publico" ||
          usuario.rol === null) && (
          <li>
            <NavLink
              to="/inicio"
              className="rounded py-2 w-100 d-inline-block px-2 linky"
              onClick={onClose}
            >
              <FaIcons.FaUniversity className="me-2" />
              Nosotros
            </NavLink>
          </li>
        )}

        {/* Solo admin puede ver estos menús */}
        {usuario.rol === "admin" && (
          <>
            <li>
              <NavLink
                to="/verestudiante"
                className="rounded py-2 w-100 d-inline-block px-2 linky"
                onClick={onClose}
              >
                <FaIcons.FaUserGraduate className="me-2" />
                Estudiante
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/verdocente"
                className="rounded py-2 w-100 d-inline-block px-2 linky"
                onClick={onClose}
              >
                <FaIcons.FaUserTie className="me-2" />
                Docente
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/vergrado"
                className="rounded py-2 w-100 d-inline-block px-2 linky"
                onClick={onClose}
              >
                <FaIcons.FaUniversity className="me-2" />
                Grado
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/curso"
                className="rounded py-2 w-100 d-inline-block px-2 linky"
                onClick={onClose}
              >
                <FaIcons.FaWallet className="me-2" />
                Curso
              </NavLink>
            </li>
          </>
        )}

        {/* Admin y docente pueden ver estos menús */}
        {(usuario.rol === "admin" || usuario.rol === "docente") && (
          <>
            <li>
              <NavLink
                to="/verasistencia"
                className="rounded py-2 w-100 d-inline-block px-2 linky"
                onClick={onClose}
              >
                <FaIcons.FaUserEdit className="me-2" />
                Asistencia
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/calificaciones"
                className="rounded py-2 w-100 d-inline-block px-2 linky"
                onClick={onClose}
              >
                <FaIcons.FaPencilAlt className="me-2" />
                Calificaciones
              </NavLink>
            </li>
            <li>
              <button className="btn rounded py-5" onClick={handleLogout}>
                <FaIcons.FaSignOutAlt className="me-1" />
                Cerrar Sesión
              </button>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
