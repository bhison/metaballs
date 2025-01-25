"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"

const Metaballs = ({
  setDebugText,
}: {
  setDebugText: (text: string) => void
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [metaballs, setMetaballs] = useState(() => {
    const width = window.innerWidth
    const height = window.innerHeight
    return Array.from({ length: 5 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 50 + 30, // Random radius between 30 and 80
      initialRadius: Math.random() * 50 + 30,
    }))
  })
  const [dragging, setDragging] = useState<number | null>(null)

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

      const intersectingBalls = findIntersectingBalls()

      let anyIntersecting = false
      for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
          const fieldStrength = calculateField(x, y)
          if (fieldStrength > threshold) {
            const index = (x + y * width) * 4
            const isIntersecting = isPixelInfluencedByIntersectingBall(
              x,
              y,
              intersectingBalls
            )
            if (isIntersecting) {
              anyIntersecting = true
              data[index] = 255 // Red
              data[index + 1] = 0 // Green
              data[index + 2] = 255 // Blue
            } else {
              data[index] = 120 // Red
              data[index + 1] = 120 // Green
              data[index + 2] = 180 // Blue
            }
            data[index + 3] = 255 // Alpha (opaque)
          }
        }
      }

      setDebugText(anyIntersecting ? "INTERSECTING" : "")

      ctx.putImageData(imageData, 0, 0)

      // Draw the initial radius text on each metaball in white
      ctx.fillStyle = "white"
      ctx.font = "16px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      metaballs.forEach((ball) => {
        ctx.fillText(Math.round(ball.initialRadius).toString(), ball.x, ball.y)
      })
    }

    const calculateField = (x: number, y: number) => {
      return metaballs.reduce((sum, ball) => {
        const dx = x - ball.x
        const dy = y - ball.y
        return sum + (ball.radius * ball.radius) / (dx * dx + dy * dy)
      }, 0)
    }

    const findIntersectingBalls = () => {
      const intersecting = new Set<number>()
      for (let i = 0; i < metaballs.length; i++) {
        for (let j = i + 1; j < metaballs.length; j++) {
          const ball1 = metaballs[i]
          const ball2 = metaballs[j]
          const dx = ball1.x - ball2.x
          const dy = ball1.y - ball2.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < ball1.radius + ball2.radius) {
            intersecting.add(i)
            intersecting.add(j)
          }
        }
      }
      return intersecting
    }

    const isPixelInfluencedByIntersectingBall = (
      x: number,
      y: number,
      intersectingBalls: Set<number>
    ) => {
      let totalInfluence = 0
      intersectingBalls.forEach((i) => {
        const ball = metaballs[i]
        const dx = x - ball.x
        const dy = y - ball.y
        totalInfluence += (ball.radius * ball.radius) / (dx * dx + dy * dy)
      })
      return totalInfluence > threshold
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

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      const touch = e.touches[0]
      const { clientX, clientY } = touch
      const rect = canvasRef.current?.getBoundingClientRect()
      if (!rect) return
      const offsetX = clientX - rect.left
      const offsetY = clientY - rect.top
      const ballIndex = metaballs.findIndex((ball) =>
        isInsideMetaball(offsetX, offsetY, ball)
      )
      if (ballIndex !== -1) {
        setDragging(ballIndex)
      }
    },
    [metaballs]
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      if (dragging !== null) {
        const touch = e.touches[0]
        const { clientX, clientY } = touch
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return
        const offsetX = clientX - rect.left
        const offsetY = clientY - rect.top
        const newMetaballs = [...metaballs]
        newMetaballs[dragging] = {
          ...newMetaballs[dragging],
          x: offsetX,
          y: offsetY,
        }
        setMetaballs(newMetaballs)
      }
    },
    [dragging, metaballs]
  )

  const handleTouchEnd = () => {
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

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Add touch event listeners
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false })
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false })
    canvas.addEventListener("touchend", handleTouchEnd)

    return () => {
      // Clean up touch event listeners
      canvas.removeEventListener("touchstart", handleTouchStart)
      canvas.removeEventListener("touchmove", handleTouchMove)
      canvas.removeEventListener("touchend", handleTouchEnd)
    }
  }, [metaballs, dragging, handleTouchStart, handleTouchMove])

  return (
    <canvas
      ref={canvasRef}
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: "1px solid black", display: "block" }}
    />
  )
}

export default Metaballs
