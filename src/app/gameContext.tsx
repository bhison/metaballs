"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { calculateResult, getNumbers, getTargetNumber } from "./lib/game";
import { Ball, Move } from "./types";

const STARTING_PLUS_POINTS = 100;
const GAME_TIME = 120;

// Define the context value type
interface GameContextType {
  newGame: () => void;
  activeBalls: Ball[];
  draggedBall: Ball | null;
  setDraggedBall: (ball: Ball | null) => void;
  target: number;
  generateNumbers: () => void;
  checkMove: ({ balls: { x, y }, operation }: Move) => number | null;
  executeMove: ({ balls: { x, y }, operation }: Move) => void;
  submitBall: (ball: Ball) => void;
  gameActive: boolean;
  playerScore: number;
  timeLeft: number;
  percentGameTime: number;
  breakBall: (ball: Ball) => void;
  submitHovered: boolean;
  setSubmitHovered: (hovered: boolean) => void;
}

// Update the context creation
const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeBalls, setActiveBalls] = useState<Ball[]>([]);
  const [target, setTarget] = useState<number>(0);
  const [draggedBall, setDraggedBall] = useState<Ball | null>(null);
  const [gameActive, setGameActive] = useState(false);
  const [plusPoints, setPlusPoints] = useState(STARTING_PLUS_POINTS);
  const [playerScore, setPlayerScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const percentGameTime = useMemo(() => {
    return Math.round((timeLeft / GAME_TIME) * 100);
  }, [timeLeft]);

  const [submitHovered, setSubmitHovered] = useState(false);
  const newGame = () => {
    setGameActive(true);
    setTimeLeft(GAME_TIME);
    setPlayerScore(0);
    setPlusPoints(STARTING_PLUS_POINTS);
    generateNumbers();
  };

  const generateNumbers = () => {
    const numbers = getNumbers();
    const target = getTargetNumber();
    setActiveBalls(
      numbers.map((n, i) => ({
        index: i,
        value: n,
        layers: 0,
      })),
    );
    setTarget(target);
  };

  const checkMove = ({ balls: { x, y }, operation }: Move) =>
    calculateResult(x.value, y.value, operation);

  const executeMove = ({ balls: { x, y }, operation }: Move) => {
    const result = calculateResult(x.value, y.value, operation);
    if (!result) return;
    setActiveBalls((prev) => {
      const others = prev.filter((b) => ![x.index, y.index].includes(b.index));
      return [
        ...others,
        {
          index: x.index,
          value: result,
          layers: x.layers + 1,
          parents: {
            x,
            y,
          },
        },
      ];
    });
  };

  const submitBall = (ball: Ball) => {
    const distance = Math.abs(ball.value - target);
    let newPlusPoints = plusPoints;
    if (distance === 0) {
      newPlusPoints = STARTING_PLUS_POINTS;
    } else {
      newPlusPoints -= distance;
    }
    setPlayerScore((prev) => prev + newPlusPoints);
    setPlusPoints(Math.max(newPlusPoints, 0));
    generateNumbers();
  };

  const breakBall = (ball: Ball) => {
    if (!ball.parents) return;
    const parents = ball.parents;
    setActiveBalls((prev) => {
      const others = prev.filter((b) => b.index !== ball.index);
      return [...others, parents.x, parents.y];
    });
  };

  useEffect(() => {
    const int = window.setInterval(() => {
      setTimeLeft((prev) => prev - 1);
      if (timeLeft === 0) {
        setGameActive(false);
      }
    }, 100);
    return () => clearInterval(int);
  }, [gameActive, timeLeft]);

  return (
    <GameContext.Provider
      value={{
        newGame,
        activeBalls,
        draggedBall,
        setDraggedBall,
        target,
        generateNumbers,
        checkMove,
        executeMove,
        submitBall,
        gameActive,
        playerScore,
        timeLeft,
        percentGameTime,
        breakBall,
        submitHovered,
        setSubmitHovered,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
