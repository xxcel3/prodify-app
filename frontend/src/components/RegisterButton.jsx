import React from "react"
import { useNavigate } from "react-router-dom"

const RegisterButton = () => {
  const navigate = useNavigate()
  return (
    <img
        src={`${import.meta.env.BASE_URL}RegisterButton.png`}
        alt="Login"
        onClick={() => navigate("/register")}
        className="cursor-pointer"
        style={{
            width: "clamp(100px, 30vw, 300px)" //  scales from 100px to 300px
        }}
    />
  )
}

export default RegisterButton
