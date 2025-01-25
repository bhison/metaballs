import { useState } from "react"
import { calculateResult, getNumbers, getTargetNumber } from "../lib/game"
import { Move } from "../types"

export const useGame = () => {
  const [numbers, setNumbers] = useState<number[]>([])
  const [target, setTarget] = useState<number | null>(null)

  const generateNumbers = () => {
    const numbers = getNumbers()
    const target = getTargetNumber()
    setNumbers(numbers)
    setTarget(target)
  }

  const checkMove = ({ ball: { x, y }, operation }: Move) =>
    !!calculateResult(x, y, operation)

  const executeMove = ({ numbers: { x, y }, operation }: Move) => {
    const result = calculateResult(x, y, operation)
    if (!result) return null
  }

  return { numbers, target, generateNumbers, checkMove, executeMove }
}
