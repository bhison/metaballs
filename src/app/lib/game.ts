import { Operation } from "../types"

const MIN_TARGET = 101
const MAX_TARGET = 999
const PROBABILITY_OF_ONE_BIG_NUMBER = 0.15
const PROBABILITY_OF_TWO_BIG_NUMBERS = 0.7

const numbers = {
  big: [25, 50, 75, 100],
  small: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
}

export const getNumbers = () => {
  const randomBigCount = Math.random()
  const bigCount =
    randomBigCount < PROBABILITY_OF_ONE_BIG_NUMBER
      ? 1
      : randomBigCount <
        PROBABILITY_OF_ONE_BIG_NUMBER + PROBABILITY_OF_TWO_BIG_NUMBERS
      ? 2
      : 3
  const smallCount = 6 - bigCount

  const returnNumbers = []
  for (let i = 0; i < bigCount; i++) {
    returnNumbers.push(
      numbers.big[Math.floor(Math.random() * numbers.big.length)]
    )
  }
  for (let i = 0; i < smallCount; i++) {
    returnNumbers.push(
      numbers.small[Math.floor(Math.random() * numbers.small.length)]
    )
  }
  return returnNumbers
}

export const getTargetNumber = () =>
  Math.floor(Math.random() * (MAX_TARGET - MIN_TARGET + 1)) + MIN_TARGET

export const calculateResult = (x: number, y: number, operation: Operation) => {
  switch (operation) {
    case "add": {
      const result = x + y
      return result < 0 || result > 999 ? null : result
    }
    case "subtract": {
      const result = x - y
      return result < 0 || result > 999 ? null : result
    }
    case "multiply": {
      const result = x * y
      const resultIsWholeNumber = Number.isInteger(result)
      return result < 0 || result > 999 || !resultIsWholeNumber ? null : result
    }
    case "divide": {
      const result = x / y
      const resultIsWholeNumber = Number.isInteger(result)
      return y === 0 || result < 0 || result > 999 || !resultIsWholeNumber
        ? null
        : result
    }
  }
}
