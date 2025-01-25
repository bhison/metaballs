"use client"

import { motion, useAnimate } from "motion/react"
import { useEffect, useState } from "react"
import Metaballs from "./Metaballs"

const CURSOR_TEXT_OFFSET = {
  x: 0,
  y: -100,
}

const Page = () => {
  const [isClient, setIsClient] = useState(false)
  const [cursorText, setCursorText] = useState("")
  const [scope, animate] = useAnimate()
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 })

  const getCursorTextWidth = () => {
    if (scope.current) {
      return scope.current.getBoundingClientRect().width
    }
    return 0
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    animate(
      scope.current,
      { y: [-30, 15, 0] },
      {
        duration: 0.2,
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
    <div className="w-full h-full relative">
      <motion.p
        className="user-select-none relative"
        style={{
          ...titleStyle,
          left:
            pointerPosition.x +
            CURSOR_TEXT_OFFSET.x +
            -getCursorTextWidth() / 2,
          top: pointerPosition.y + CURSOR_TEXT_OFFSET.y,
        }}
        ref={scope}
      >
        {cursorText}
      </motion.p>
      {isClient && <Metaballs setDebugText={setCursorText} />}
      <div
        className="absolute inset-0 bg-black opacity-70 pointer-events-none z-[-10]" // Add this overlay
        style={{
          backgroundImage: "url('/img/cloud-bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
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
