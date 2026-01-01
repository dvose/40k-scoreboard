import { useGameSessionStore } from "../hooks/stores/gameSessionStore";
import { usePlayerGameSessionStore } from "../hooks/stores/playerGameSessionStore";
import { v4 as uuidv4 } from "uuid";
import type { GameSession } from "../models/gameSession";
import type { PlayerGameSession } from "../models/playerGameSession";

const MAX_ROUNDS = 5;

const createGameSession = (playersUuids: string[]) => {
  const { addGameSession } = useGameSessionStore();
  const { addPlayerGameSession } = usePlayerGameSessionStore();
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

const loadGameSession = (gameSessionUuid: string) => {
  const { findGameSessionByUuid } = useGameSessionStore();
  const { findByGameSessionUuid } = usePlayerGameSessionStore();
  return {
    gameSession: findGameSessionByUuid(gameSessionUuid),
    playerGameSessions: findByGameSessionUuid(gameSessionUuid)
  };
};

const nextPlayer = (gameSession: GameSession, playerGameSession: PlayerGameSession[]) => {
  const nextIndex = (gameSession.currentPlayerIndex + 1) % playerGameSession.length;
  gameSession.currentPlayerIndex = nextIndex;
  if (nextIndex === 0) {
    console.log("Round completed");
    return endRound(gameSession);
  }
  return gameSession;
}

const endRound = (gameSession: GameSession) => {
  if (gameSession.currentRound >= MAX_ROUNDS) {
    console.log("Max rounds reached");
    gameSession.endedAt = new Date();
    return gameSession;
  }
  gameSession.currentRound += 1;
  return gameSession;
}

export const GameSessionService = {
  createGameSession,
  loadGameSession,
  nextPlayer,
  endRound
};