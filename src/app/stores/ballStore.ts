import { create } from "zustand";
import { Ball } from "../types";

type State = {
  draggedBall: Ball | null;
};

type Actions = {
  setDraggedBall: (ball: Ball | null) => void;
};

const useBallStore = create<State & Actions>((set) => ({
  draggedBall: null as Ball | null,
  setDraggedBall: (ball: Ball | null) => set({ draggedBall: ball }),
}));

export default useBallStore;
