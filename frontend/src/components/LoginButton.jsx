import React from "react"
import { useNavigate } from "react-router-dom"

const LoginButton = () => {
  const navigate = useNavigate()
  return (
    <img
        src={`${import.meta.env.BASE_URL}LoginButton.png`}
        alt="Login"
        onClick={() => navigate("/login")}
        className="cursor-pointer"
        style={{
            width: "clamp(100px, 30vw, 300px)" //  scales from 100px to 300px
        }}
    />
  )
}

export default LoginButton
