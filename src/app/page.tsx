"use client"

import { motion, useAnimate } from "framer-motion"
import { useEffect, useState } from "react"
import Metaballs from "./Metaballs"

const CURSOR_TEXT_OFFSET = {
  x: 25,
  y: -30,
}

const Page = () => {
  const [isClient, setIsClient] = useState(false)
  const [cursorText, setCursorText] = useState("")
  const [scope, animate] = useAnimate()
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    animate(
      scope.current,
      { y: [-30, 15, 0] },
      {
        duration: 0.2,
        // repeat:
        ease: "easeOut",
      }
    )
  }, [cursorText, animate, scope])

  useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      setPointerPosition({ x: event.clientX, y: event.clientY })
    }

    window.addEventListener("pointermove", handlePointerMove)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
    }
  }, [])

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <motion.p
        className="user-select-none"
        style={{
          ...titleStyle,
          left: pointerPosition.x + CURSOR_TEXT_OFFSET.x,
          top: pointerPosition.y + CURSOR_TEXT_OFFSET.y,
        }}
        ref={scope}
      >
        {cursorText}
      </motion.p>
      {isClient && (
        <div>
          <Metaballs setDebugText={setCursorText} />
        </div>
      )}
    </div>
  )
}

const titleStyle: React.CSSProperties = {
  position: "absolute",
  transform: "translate(-50%, -50%)", // Centers the text over the pointer
  fontSize: "3rem",
  // color: "#ff69b4", // Hot pink color
  color: "aliceblue",
  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
  pointerEvents: "none", // Ensures it doesn't block input
  zIndex: 10, // Ensures it appears in the foreground
}

export default Page
