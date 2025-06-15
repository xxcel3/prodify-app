import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Button.css"; 

const RegisterButton = () => {
  const navigate = useNavigate();
  return (
    <img
      src={`${import.meta.env.BASE_URL}RegisterButton.png`}
      alt="Register"
      onClick={() => navigate("/register")}
      className="button"
    />
  );
};

export default RegisterButton;
