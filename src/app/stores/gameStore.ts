import { create } from "zustand";
import { calculateResult, getNumbers, getTargetNumber } from "../lib/game";
import { Ball, Move } from "../types";

type State = {
  activeBalls: Ball[];
  target: number;
  draggedBall: Ball | null;
  gameActive: boolean;
  playerScore: number;
  plusPoints: number;
};

type Actions = {
  newGame: () => void;
  generateNumbers: () => void;
  checkMove: ({ balls: { x, y }, operation }: Move) => number | null;
  executeMove: ({ balls: { x, y }, operation }: Move) => void;
  submitBall: (ball: Ball) => void;
  breakBall: (ball: Ball) => void;
  setGameActive: (active: boolean) => void;
};

const useGameStore = create<State & Actions>((set) => ({
  activeBalls: [] as Ball[],
  target: 0,
  draggedBall: null as Ball | null,
  gameActive: false,
  playerScore: 0,
  plusPoints: 100, // Assuming STARTING_PLUS_POINTS is 100

  newGame: () => {
    set({ gameActive: true, playerScore: 0, plusPoints: 100 });
    // Call generateNumbers here if needed
  },

  generateNumbers: () => {
    const numbers = getNumbers();
    const target = getTargetNumber();
    set({
      activeBalls: numbers.map((n, i) => ({
        index: i,
        value: n,
        layers: 0,
      })),
      target,
    });
  },

  checkMove: ({ balls: { x, y }, operation }: Move) =>
    calculateResult(x.value, y.value, operation),

  executeMove: ({ balls: { x, y }, operation }: Move) => {
    const result = calculateResult(x.value, y.value, operation);
    if (!result) return;
    set((state) => {
      const others = state.activeBalls.filter(
        (b) => ![x.index, y.index].includes(b.index),
      );
      return {
        activeBalls: [
          ...others,
          {
            index: x.index,
            value: result,
            layers: x.layers + 1,
            parents: { x, y },
          },
        ],
      };
    });
  },
  submitBall: (ball: Ball) => {
    console.log("submitBall", ball);
  },

  breakBall: (ball: Ball) => {
    console.log("breakBall", ball);
  },
  setGameActive: (active: boolean) => set({ gameActive: active }),
}));

export default useGameStore;
