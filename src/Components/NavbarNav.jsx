import React, { useState, useContext } from "react";

import { Navbar, NavbarBrand, NavbarToggler } from "reactstrap";

function NavbarNav(props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <Navbar color="dark">
      <NavbarBrand href="/" style={{ color: "#fff", zIndex: 2, position: "relative" }}>E.O.U.M José Joaquín Palma</NavbarBrand>
   
    </Navbar>
  );
}

export default NavbarNav;
