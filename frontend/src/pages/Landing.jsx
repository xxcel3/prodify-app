import React from "react"
import "../styles/Landing.css"
import LoginButton from "../components/LoginButton"
import RegisterButton from "../components/RegisterButton"
import Desk from "../components/Desk"



const Landing = () => {
  return (
    <div className="landing-container">

      <div className="desk-column">
        <div className="buttons-box">
          <LoginButton />
          <RegisterButton />
        </div>
        <div className="desk-wrapper">
          <Desk />
        </div>
      </div>
      <div className="right-column ">

      </div>
    </div>
  )
}

export default Landing