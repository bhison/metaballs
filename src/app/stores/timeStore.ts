import { create } from "zustand";

type State = {
  timeLeft: number;
  timeLeftPercentage: number;
};

const STARTING_TIME_LEFT = 120;

type Actions = {
  setTimeLeft: (time: number) => void;
  resetTimeLeft: () => void;
};

const useTimeStore = create<State & Actions>((set) => ({
  timeLeft: 120,
  setTimeLeft: (time: number) =>
    set({ timeLeft: time, timeLeftPercentage: time / STARTING_TIME_LEFT }),
  timeLeftPercentage: 0,
  resetTimeLeft: () =>
    set({ timeLeft: STARTING_TIME_LEFT, timeLeftPercentage: 1 }),
  updateTimeLeft: () =>
    set((state) => {
      const newTimeLeft = state.timeLeft - 1;
      return {
        timeLeft: newTimeLeft,
        timeLeftPercentage: Math.round(newTimeLeft / STARTING_TIME_LEFT),
      };
    }),
}));

export default useTimeStore;
