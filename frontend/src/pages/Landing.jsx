import React from "react"
import "../styles/Landing.css"
import LoginButton from "../components/LoginButton"
import RegisterButton from "../components/RegisterButton"
import TypingTitle from "../components/TypingTitle"
import Desk from "../components/Desk"
import RainOverlay from "../components/RainOverlay"

const Landing = () => {
  return (
    <div className="landing-container">
      <RainOverlay />
      {/* RIGHT COLUMN — Typing */}
      <div className="right-column">
        <div className="right-inner">
          <TypingTitle />
        </div>
      </div>

      {/* LEFT COLUMN — Buttons + Desk */}
      <div className="desk-column">
        <div className="buttons-box">
          <LoginButton />
          <RegisterButton />
        </div>
        <div className="desk-wrapper">
          <Desk />
        </div>
      </div>
    </div>
  )
}

export default Landing
