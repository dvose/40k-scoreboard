import { useGameSessionStore } from "../hooks/stores/gameSessionStore";
import { usePlayerGameSessionStore } from "../hooks/stores/playerGameSessionStore";
import { v4 as uuidv4 } from "uuid";
import type { GameSession } from "../models/gameSession";
import type { PlayerGameSession } from "../models/playerGameSession";
import { usePlayerStore } from "./stores/playerStore";

const MAX_ROUNDS = 5;

export const useGameSession = () => {
  const { addGameSession, findGameSessionByUuid, updateGameSession } = useGameSessionStore();
  const { findPlayerByUuid } = usePlayerStore();
  const { addPlayerGameSession, findByGameSessionUuid, updateScores } = usePlayerGameSessionStore();

  const createGameSession = (playersUuids: string[]) => {
    const uuid = uuidv4();
    addGameSession({ uuid, createdAt: new Date(), currentRound: 1, currentPlayerIndex: 0 });
    playersUuids.forEach((playerUuid, index) => {
      addPlayerGameSession({
        order: index,
        playerUuid: playerUuid,
        gameSessionUuid: uuid,
        cp: 0,
        sp: 0,
        vp: 0,
      });
    });

    return uuid;
  };

  const loadPlayerGameSessions = (gameSessionUuid: string) => {
    const playerGameSessions = findByGameSessionUuid(gameSessionUuid);
    return playerGameSessions.map(pgs => ({
      session: pgs,
      player: findPlayerByUuid(pgs.playerUuid)
    }));
  }

  const loadGameSession = (gameSessionUuid: string) => {
    return {
      gameSession: findGameSessionByUuid(gameSessionUuid),
      playerGameSessions: loadPlayerGameSessions(gameSessionUuid),
    };
  };

  const updatePlayerScores = (playerGameSession: PlayerGameSession, cp: number, sp: number, vp: number) => {
    const p = {...playerGameSession}
    p.cp = cp;
    p.sp = sp;
    p.vp = vp;
    updateScores(playerGameSession.gameSessionUuid, playerGameSession.playerUuid, {cp, sp, vp});
    return p;
  };

  const nextPlayer = (gameSession: GameSession, playerGameSession: PlayerGameSession[]) => {
    const nextIndex = (gameSession.currentPlayerIndex + 1) % playerGameSession.length;
    if (nextIndex === 0) {
      return endRound(gameSession);
    }
    gameSession.currentPlayerIndex = nextIndex;
    updateGameSession(gameSession.uuid, { currentPlayerIndex: gameSession.currentPlayerIndex });
    return gameSession;
  };

  const endRound = (gameSession: GameSession) => {
    if (gameSession.currentRound >= MAX_ROUNDS) {
      gameSession.endedAt = new Date();
      gameSession.currentPlayerIndex = -1;
      updateGameSession(gameSession.uuid, { currentPlayerIndex: -1, endedAt: gameSession.endedAt});
      return gameSession;
    }
    gameSession.currentRound += 1;
    gameSession.currentPlayerIndex = 0;
    updateGameSession(gameSession.uuid, { currentPlayerIndex: gameSession.currentPlayerIndex, currentRound: gameSession.currentRound });
    return gameSession;
  };

  return {
    createGameSession,
    loadGameSession,
    nextPlayer,
    updatePlayerScores,
    endRound
  }
}
