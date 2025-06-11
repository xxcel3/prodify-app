import React from "react"

const Desk = () => {
  return (
    <img
      src={`${import.meta.env.BASE_URL}Desk.png`}
      alt="Desk"
      className="w-full h-full object-contain"
      style={{ maxHeight: "100%", maxWidth: "100%" }}
    />
  )
}

export default Desk
