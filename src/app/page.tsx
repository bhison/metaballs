"use client"

import { motion, useAnimate } from "motion/react"
import { useEffect, useState } from "react"
import Metaballs from "./Metaballs"

const CURSOR_TEXT_OFFSET = 40

const symbols = {
  plus: "+",
  minus: "-",
  times: "×",
  divide: "÷",
}

const Page = () => {
  const [isClient, setIsClient] = useState(false)
  const [cursorText, setCursorText] = useState("")
  const [scope, animate] = useAnimate()
  const [pointerPosition, setPointerPosition] = useState({ x: 0, y: 0 })

  const calculatedCursorTextOffset = (() => {
    if (!cursorText || !cursorText.length || !scope.current)
      return { x: 200, y: 0 }
    const cursorTextCenterOffsetX = -(
      scope.current.getBoundingClientRect().width / 2
    )
    const cursorTextCenterOffsetY = -(
      scope.current.getBoundingClientRect().height / 2
    )

    if (cursorText === "plus") {
      return {
        x: cursorTextCenterOffsetX + CURSOR_TEXT_OFFSET,
        y: cursorTextCenterOffsetY,
      }
    }
    if (cursorText === "minus") {
      return {
        x: cursorTextCenterOffsetX - CURSOR_TEXT_OFFSET,
        y: cursorTextCenterOffsetY,
      }
    }
    if (cursorText === "times") {
      return {
        x: cursorTextCenterOffsetX,
        y: cursorTextCenterOffsetY - CURSOR_TEXT_OFFSET,
      }
    }
    if (cursorText === "divide") {
      return {
        x: cursorTextCenterOffsetX,
        y: cursorTextCenterOffsetY + CURSOR_TEXT_OFFSET,
      }
    }

    // if (cursorText === "plus")
    //   return { x: -(cursorTextCenterOffset + CURSOR_TEXT_OFFSET), y: 0 }
    // if (cursorText === "minus")
    //   return { x: cursorTextCenterOffset + CURSOR_TEXT_OFFSET, y: 0 }
    // if (cursorText === "times")
    //   return { x: cursorTextCenterOffset, y: -CURSOR_TEXT_OFFSET }
    // if (cursorText === "divide")
    //   return { x: cursorTextCenterOffset, y: CURSOR_TEXT_OFFSET }
    return { x: cursorTextCenterOffsetX, y: cursorTextCenterOffsetY }
  })()

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
          left: pointerPosition.x + calculatedCursorTextOffset.x,
          top: pointerPosition.y + calculatedCursorTextOffset.y,
        }}
        ref={scope}
      >
        {symbols[cursorText as keyof typeof symbols]}
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
