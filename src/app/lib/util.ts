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
) => {
  const dx = ball2.x - ball1.x
  const dy = ball2.y - ball1.y

  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? "West" : "East"
  } else {
    return dy > 0
      ? "North"
      : `South (b1: ${ball1.x}, ${ball1.y}) (b2: ${ball2.x}, ${ball2.y})`
  }
}
