import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Button.css"; 

const LoginButton = () => {
  const navigate = useNavigate();
  return (
    <img
      src={`${import.meta.env.BASE_URL}LoginButton.png`}
      alt="Login"
      onClick={() => navigate("/login")}
      className="button"
    />
  );
};

export default LoginButton;
