import React from "react"
import Metaballs from "./Metaballs"

const Page = () => {
  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <h1 style={titleStyle}>METABALLS</h1>
      <Metaballs />
    </div>
  )
}

const titleStyle: React.CSSProperties = {
  position: "absolute",
  top: "10%",
  left: "10%",
  transform: "rotate(-15deg)",
  fontSize: "3rem",
  color: "#ff69b4", // Hot pink color
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  pointerEvents: "none", // Ensures it doesn't block input
  zIndex: 10, // Ensures it appears in the foreground
}

export default Page
