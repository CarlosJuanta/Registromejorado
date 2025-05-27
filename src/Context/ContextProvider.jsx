import React, { useState, createContext } from "react";
import API_URL from "../Configure";
export const Contexto = createContext();
const ContextProvider = ({ children }) => {
  const tipoUsuario = {
    rol: null,
    admin: "admin",
    docente: "docente",
    publico: "publico",
  };
  const [usuario, setUsuario] = useState(tipoUsuario);

  const fetchUser = async (username, password) => {
    try {
      const response = await fetch(`${API_URL}/docente/getbyusername`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Asegúrate de incluir esta opción
      });

      if (!response.ok) {
        setUsuario({ rol: null });

        return null;
      } else {
        const user = await response.json();

        if (!user) {
          setUsuario({ rol: "publico" });
          return "publico";
        } else {
          setUsuario(user);
          return user.rol;
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Contexto.Provider
      value={{
        usuario,
        fetchUser,
        setUsuario,
      }}
    >
      {children}
    </Contexto.Provider>
  );
};

export default ContextProvider;
