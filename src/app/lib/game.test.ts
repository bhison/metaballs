// test the getNumbers function

import { getNumbers, getTargetNumber } from "./game"

test("getNumbers returns 6 numbers", () => {
  const numbers = getNumbers()
  expect(numbers.length).toBe(6)
  // now just run it 10 times and print
  for (let i = 0; i < 10; i++) {
    console.log(getNumbers())
  }
})

test("getTargetNumber returns a number", () => {
  const numbers = getNumbers()
  const target = getTargetNumber(numbers)
  console.log(numbers, target)
  expect(target).toBeDefined()
})
