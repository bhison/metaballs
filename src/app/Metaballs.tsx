"use client"

import React, { useEffect, useRef, useState } from "react"

const Metaballs = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [metaballs, setMetaballs] = useState([
    { x: 200, y: 200, radius: 50 },
    { x: 400, y: 300, radius: 70 },
  ])
  const [dragging, setDragging] = useState<number | null>(null)

  const gridSize = 10 // Size of each grid cell
  const threshold = 1.0 // Threshold for contour

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const drawMetaballs = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const width = canvas.width
      const height = canvas.height

      for (let x = 0; x < width; x += gridSize) {
        for (let y = 0; y < height; y += gridSize) {
          const value = calculateField(x, y)
          if (value > threshold) {
            ctx.fillStyle = "black"
            ctx.fillRect(x, y, gridSize, gridSize)
          }
        }
      }
    }

    const calculateField = (x: number, y: number) => {
      return metaballs.reduce((sum, ball) => {
        const dx = x - ball.x
        const dy = y - ball.y
        return sum + (ball.radius * ball.radius) / (dx * dx + dy * dy)
      }, 0)
    }

    drawMetaballs()
  }, [metaballs])

  const handleMouseDown = (e: React.MouseEvent) => {
    const { offsetX, offsetY } = e.nativeEvent
    const ballIndex = metaballs.findIndex((ball) =>
      isInsideMetaball(offsetX, offsetY, ball)
    )
    if (ballIndex !== -1) {
      setDragging(ballIndex)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (dragging !== null) {
      const { offsetX, offsetY } = e.nativeEvent
      const newMetaballs = [...metaballs]
      newMetaballs[dragging] = {
        ...newMetaballs[dragging],
        x: offsetX,
        y: offsetY,
      }
      setMetaballs(newMetaballs)
    }
  }

  const handleMouseUp = () => {
    setDragging(null)
  }

  const isInsideMetaball = (
    x: number,
    y: number,
    ball: { x: number; y: number; radius: number }
  ) => {
    const dx = x - ball.x
    const dy = y - ball.y
    return Math.sqrt(dx * dx + dy * dy) < ball.radius
  }

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: "1px solid black" }}
    />
  )
}

export default Metaballs
