"use client"

import React, { useEffect, useRef, useState } from "react"

const Metaballs = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [metaballs, setMetaballs] = useState([
    { x: 200, y: 200, radius: 50, initialRadius: 50 },
    { x: 400, y: 300, radius: 70, initialRadius: 70 },
    { x: 300, y: 100, radius: 45, initialRadius: 45 },
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
          const square = [
            calculateField(x, y),
            calculateField(x + gridSize, y),
            calculateField(x + gridSize, y + gridSize),
            calculateField(x, y + gridSize),
          ]

          const caseIndex = square.reduce(
            (acc, val, idx) => acc | ((val > threshold ? 1 : 0) << idx),
            0
          )

          // Draw lines based on the case index
          switch (caseIndex) {
            case 1:
            case 14:
              drawLine(
                ctx,
                interpolate(x, y + gridSize, x, y, square[3], square[0]),
                interpolate(x, y, x + gridSize, y, square[0], square[1])
              )
              break
            case 2:
            case 13:
              drawLine(
                ctx,
                interpolate(
                  x + gridSize,
                  y,
                  x + gridSize,
                  y + gridSize,
                  square[1],
                  square[2]
                ),
                interpolate(x, y, x + gridSize, y, square[0], square[1])
              )
              break
            case 3:
            case 12:
              drawLine(
                ctx,
                interpolate(x, y + gridSize, x, y, square[3], square[0]),
                interpolate(
                  x + gridSize,
                  y,
                  x + gridSize,
                  y + gridSize,
                  square[1],
                  square[2]
                )
              )
              break
            case 4:
            case 11:
              drawLine(
                ctx,
                interpolate(
                  x + gridSize,
                  y,
                  x + gridSize,
                  y + gridSize,
                  square[1],
                  square[2]
                ),
                interpolate(
                  x,
                  y + gridSize,
                  x + gridSize,
                  y + gridSize,
                  square[3],
                  square[2]
                )
              )
              break
            case 5:
              drawLine(
                ctx,
                interpolate(x, y + gridSize, x, y, square[3], square[0]),
                interpolate(x, y, x + gridSize, y, square[0], square[1])
              )
              drawLine(
                ctx,
                interpolate(
                  x + gridSize,
                  y,
                  x + gridSize,
                  y + gridSize,
                  square[1],
                  square[2]
                ),
                interpolate(
                  x,
                  y + gridSize,
                  x + gridSize,
                  y + gridSize,
                  square[3],
                  square[2]
                )
              )
              break
            case 6:
            case 9:
              drawLine(
                ctx,
                interpolate(x, y, x + gridSize, y, square[0], square[1]),
                interpolate(
                  x,
                  y + gridSize,
                  x + gridSize,
                  y + gridSize,
                  square[3],
                  square[2]
                )
              )
              break
            case 7:
            case 8:
              drawLine(
                ctx,
                interpolate(x, y + gridSize, x, y, square[3], square[0]),
                interpolate(
                  x,
                  y + gridSize,
                  x + gridSize,
                  y + gridSize,
                  square[3],
                  square[2]
                )
              )
              break
            case 10:
              drawLine(
                ctx,
                interpolate(x, y, x + gridSize, y, square[0], square[1]),
                interpolate(
                  x + gridSize,
                  y,
                  x + gridSize,
                  y + gridSize,
                  square[1],
                  square[2]
                )
              )
              drawLine(
                ctx,
                interpolate(x, y + gridSize, x, y, square[3], square[0]),
                interpolate(
                  x,
                  y + gridSize,
                  x + gridSize,
                  y + gridSize,
                  square[3],
                  square[2]
                )
              )
              break
          }
        }
      }

      // Draw the initial radius on each metaball
      ctx.fillStyle = "black"
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
