export type Operation = "add" | "subtract" | "multiply" | "divide"

export type Metaball = {
  x: number
  y: number
  radius: number
  initialRadius: number
}

export type Ball = {
  index: number
  value: number
  layers: number
  parents?: {
    x: Ball
    y: Ball
  }
}

export type Move = {
  balls: {
    x: Ball
    y: Ball
  }
  operation: Operation
}
