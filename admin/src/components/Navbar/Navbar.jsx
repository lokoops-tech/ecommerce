import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "../Navbar/Navbar.css";

const Navbar = () => {


  return (
    
      <div className="navbar">
        <div className="nav-logo">GICH-TECH</div>
        <div className="nav-user-icon">
        <FaUserCircle 
        size={30} 
       style={{ cursor: "pointer", color: "#fff" }} 
         />
  </div>
  </div>
  
  
  );
  }

export default Navbar;
