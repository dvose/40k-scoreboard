import { create } from "zustand";
import { type Player } from "../../models/player";
import { createJSONStorage, persist } from "zustand/middleware";

interface PlayerState {
  players: Player[];
  findPlayerByUuid: (playerUuid: string) => Player | undefined;
  addPlayer: (player: Player) => void;
  updatePlayer: (player: Player) => void;
  removePlayer: (playerUuid: string) => void;
  clearPlayers: () => void;
}

export const usePlayerStore = create<PlayerState>()(
    persist((set, get) => ({
      players: [],
      addPlayer: (player: Player) => set((state) => ({ players: [...state.players, player] })),
      updatePlayer: (player: Player) =>
        set((state) => ({
          players: state.players.map((p) => (p.uuid === player.uuid ? player : p)),
        })),
      findPlayerByUuid: (playerUuid: string) => {
        return get().players.find((player) => player.uuid === playerUuid);
      },
      removePlayer: (playerUuid: string) =>
        set((state) => ({
          players: state.players.filter((player) => player.uuid !== playerUuid),
        })),
      clearPlayers: () => set({ players: [] }),
    }),
    {
      name: "player-store",
      storage: createJSONStorage(() => sessionStorage),
    }));
