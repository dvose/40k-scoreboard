export interface GameSession {
  uuid: string;
  currentPlayerIndex: number;
  createdAt: Date;
  endedAt?: Date;
  currentRound: number;
}