import { create } from "zustand";
import { type GameSession } from "../../models/gameSession";
import { createJSONStorage, persist } from "zustand/middleware";

interface GameSessionState {
  gameSessions: GameSession[];
  addGameSession: (gameSession: GameSession) => void;
  findGameSessionByUuid: (gameSessionUuid: string) => GameSession | undefined;
  updateGameSession: (gameSessionUuid: string, updates: Partial<GameSession>) => void;
  removeGameSession: (gameSessionUuid: string) => void;
  clearGameSessions: () => void;
}

export const useGameSessionStore = create<GameSessionState>()(
    persist((set, get) => ({
      gameSessions: [],
      addGameSession: (gameSession: GameSession) =>
        set((state) => ({ gameSessions: [...state.gameSessions, gameSession] })),
      findGameSessionByUuid: (gameSessionUuid: string) => {
        return get().gameSessions.find(
          (session) => session.uuid === gameSessionUuid
        );
      },
      updateGameSession: (gameSessionUuid: string, updates: Partial<GameSession>) =>
        set((state) => ({
          gameSessions: state.gameSessions.map((session) =>
            session.uuid === gameSessionUuid ? { ...session, ...updates } : session
          ),
        })),
      removeGameSession: (gameSessionUuid: string) =>
        set((state) => ({
          gameSessions: state.gameSessions.filter(
            (gameSession) => gameSession.uuid !== gameSessionUuid
          ),
        })),
      clearGameSessions: () => set({ gameSessions: [] }),
    }),
    {
      name: "game-session-store",
      storage: createJSONStorage(() => sessionStorage),
    }
  ));