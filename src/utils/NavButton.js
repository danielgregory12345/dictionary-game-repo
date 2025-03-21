import React from "react";
import { useNavigate } from "react-router-dom";

const NavButton = ({ to, label }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(to)}
      className="nav-button"
    >
      {label}
    </button>
  );
};

export default NavButton;
