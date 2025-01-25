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
  parents: {
    x: Ball
    y: Ball
  }
}

export type Move = {
  numbers: {
    x: number
    y: number
  }
  operation: Operation
}
