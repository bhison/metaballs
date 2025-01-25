import clsx, { ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Metaball } from "../types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const hexToRgb = (hex: string): [number, number, number] => {
  // Remove the hash symbol if present
  hex = hex.replace(/^#/, "")
  const bigint = parseInt(hex, 16)
  const r = (bigint >> 16) & 255
  const g = (bigint >> 8) & 255
  const b = bigint & 255
  return [r, g, b]
}

export const calculateRelativeDirection = (
  ball1: { x: number; y: number },
  ball2: { x: number; y: number }
): "plus" | "minus" | "times" | "divide" => {
  const dx = ball2.x - ball1.x
  const dy = ball2.y - ball1.y

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "plus" : "minus"
  } else {
    return dy > 0 ? "divide" : "times"
  }
}

const maxOverallAttempts = 1000
export const generateBalls = (
  count: number,
  overallAttempts = 0
): Metaball[] => {
  const width = window.innerWidth
  const height = window.innerHeight
  const balls: {
    x: number
    y: number
    radius: number
    initialRadius: number
  }[] = []
  const minDistance = 100 // Minimum distance between balls
  const buffer = 20 // Buffer around the edges
  const maxAttempts = 100 // Maximum attempts to place a ball

  let attempts = 0

  const maxBubbleSize = 50
  const minBubbleSize = 30

  const adjustedMaxBubbleSize = Math.max(
    minBubbleSize,
    maxBubbleSize - attempts / 10
  )

  while (balls.length < 6 && attempts < maxAttempts) {
    const radius =
      Math.random() * (adjustedMaxBubbleSize - minBubbleSize) + minBubbleSize
    const x =
      Math.random() * (width - radius * 2 - buffer * 2) + radius + buffer // Ensure ball is fully within width with buffer
    const y =
      Math.random() * (height * 0.75 - radius * 2 - buffer) +
      (height * 0.25 + radius) // Ensure ball is not in top 25% and within height with buffer

    // Check if the new ball overlaps with existing balls
    const isOverlapping = balls.some((ball) => {
      const dx = x - ball.x
      const dy = y - ball.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      return distance < radius + ball.radius + minDistance
    })

    if (!isOverlapping) {
      balls.push({
        x,
        y,
        radius,
        initialRadius: radius,
      })
    } else {
      attempts++ // Increment attempts if overlapping
    }
  }

  // If we exceed max attempts, reset and try again
  if (attempts >= maxAttempts) {
    if (overallAttempts >= maxOverallAttempts) {
      throw new Error("OH NO")
    }
    return generateBalls(count, overallAttempts + 1)
  }

  return balls
}

