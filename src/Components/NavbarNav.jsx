import React, { useState, useContext } from "react";

import { Navbar, NavbarBrand, NavbarToggler } from "reactstrap";

function NavbarNav(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar
      className="flex-nowrap justify-content-start"
      style={{ backgroundColor: "#3d2828" }}
      dark
      expand="md"
    >
      <NavbarBrand
        href="/"
        style={{ color: "white", zIndex: 3, position: "relative" }}
        className=" font-monospace fs-6  ms-auto"
      >
        E.O.U.M José Joaquín Palma
        <img
          src="src\Imagenes\logoescuela.png"
          alt="Logo"
          style={{
            width: "30px",
            height: "30px",
            opacity: 0.7,
            marginLeft: "15px",
          }}
        ></img>
      </NavbarBrand>
    </Navbar>
  );
}

export default NavbarNav;
