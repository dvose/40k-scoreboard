import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { type PlayerGameSession } from "../../models/playerGameSession";

interface PlayerGameSessionState {
  playerGameSessions: PlayerGameSession[];
  findByGameSessionUuid: (gameSessionUuid: string) => PlayerGameSession[];
  addPlayerGameSession: (playerGameSession: PlayerGameSession) => void;
  updateScores: (gameSessionUuid: string, playerUuid: string, scores: { cp?: number; sp?: number; vp?: number }) => void;
  removePlayerGameSession: (gameSessionUuid: string) => void;
  clearGameSessions: () => void;
}

export const usePlayerGameSessionStore = create<PlayerGameSessionState>()(
    persist((set, get) => ({
      playerGameSessions: [],
      findByGameSessionUuid: (gameSessionUuid: string) => {
        return get().playerGameSessions.filter((session) => session.gameSessionUuid === gameSessionUuid);
      },
      addPlayerGameSession: (playerGameSession: PlayerGameSession) =>
        set((state) => ({ playerGameSessions: [...state.playerGameSessions, playerGameSession] })),
      updateScores: (gameSessionUuid: string, playerUuid: string, scores: { cp?: number; sp?: number; vp?: number }) =>
        set((state) => ({
          playerGameSessions: state.playerGameSessions.map((session) => {
            if (session.gameSessionUuid === gameSessionUuid && session.playerUuid === playerUuid) {
              return {
                ...session,
                cp: scores.cp !== undefined ? scores.cp : session.cp,
                sp: scores.sp !== undefined ? scores.sp : session.sp,
                vp: scores.vp !== undefined ? scores.vp : session.vp,
              };
            }
            return session;
          }),
        })),
      removePlayerGameSession: (gameSessionUuid: string) =>
        set((state) => ({
          playerGameSessions: state.playerGameSessions.filter(
            (gameSession) => gameSession.gameSessionUuid !== gameSessionUuid
          ),
        })),
      clearGameSessions: () => set({ playerGameSessions: [] }),
    }),
    {
        name: "player-game-session-store",
        storage: createJSONStorage(() => sessionStorage),
    })
  );
