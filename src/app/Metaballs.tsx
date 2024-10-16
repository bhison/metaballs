"use client"

import React, { useEffect, useRef, useState } from "react"

const Metaballs = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [metaballs, setMetaballs] = useState([
    { x: 100, y: 150, radius: 40, initialRadius: 40 },
    { x: 250, y: 250, radius: 60, initialRadius: 60 },
    { x: 400, y: 100, radius: 50, initialRadius: 50 },
    { x: 550, y: 300, radius: 70, initialRadius: 70 },
    { x: 700, y: 200, radius: 45, initialRadius: 45 },
    { x: 150, y: 400, radius: 55, initialRadius: 55 },
    { x: 600, y: 450, radius: 65, initialRadius: 65 },
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

      const imageData = ctx.createImageData(width, height)
      const data = imageData.data

      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const fieldStrength = calculateField(x, y)
          if (fieldStrength > threshold) {
            const index = (x + y * width) * 4
            data[index] = 120 // Red
            data[index + 1] = 120 // Green
            data[index + 2] = 180 // Blue
            data[index + 3] = 255 // Alpha (opaque)
          }
        }
      }

      ctx.putImageData(imageData, 0, 0)

      // Draw the initial radius text on each metaball in white
      ctx.fillStyle = "white"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      metaballs.forEach((ball) => {
        ctx.fillText(ball.initialRadius.toString(), ball.x, ball.y)
      })
    }

    const calculateField = (x: number, y: number) => {
      return metaballs.reduce((sum, ball) => {
        const dx = x - ball.x
        const dy = y - ball.y
        return sum + (ball.radius * ball.radius) / (dx * dx + dy * dy)
      }, 0)
    }

    const interpolate = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      val1: number,
      val2: number
    ) => {
      const t = (threshold - val1) / (val2 - val1)
      return { x: x1 + t * (x2 - x1), y: y1 + t * (y2 - y1) }
    }

    const drawLine = (
      ctx: CanvasRenderingContext2D,
      p1: { x: number; y: number },
      p2: { x: number; y: number }
    ) => {
      ctx.beginPath()
      ctx.moveTo(p1.x, p1.y)
      ctx.lineTo(p2.x, p2.y)
      ctx.stroke()
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
