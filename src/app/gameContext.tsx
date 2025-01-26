"use client";

import { createContext, useContext } from "react";
import useBallStore from "./stores/ballStore";
import useGameStore from "./stores/gameStore";
import useTimeStore from "./stores/timeStore";
import { Ball } from "./types";

type GameContextType = {
  newGame: () => void;
  activeBalls: Ball[];
  draggedBall: Ball | null;
  setDraggedBall: (ball: Ball | null) => void;
  target: number;
  timeLeft: number;
  timeLeftPercentage: number;
  playerScore: number;
  gameActive: boolean;
};

const GameContext = createContext<GameContextType | null>(null);

export const GameProvider = ({ children }: { children: React.ReactNode }) => {
  const { timeLeft, timeLeftPercentage } = useTimeStore();
  const { newGame, activeBalls, target, gameActive, playerScore } =
    useGameStore();
  const { draggedBall, setDraggedBall } = useBallStore();

  return (
    <GameContext.Provider
      value={{
        newGame,
        activeBalls,
        draggedBall,
        setDraggedBall,
        target,
        timeLeft,
        timeLeftPercentage,
        playerScore,
        gameActive,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
