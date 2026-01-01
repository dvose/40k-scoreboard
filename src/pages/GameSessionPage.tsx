import { useParams } from "react-router";
import { useGameSession } from "../hooks/useGameSession";
import { Fragment, useEffect, useState } from "react";
import type { GameSession } from "../models/gameSession";
import type { PlayerGameSession } from "../models/playerGameSession";
import type { Player } from "../models/player";

const GameSessionPage = () => {
  const params = useParams();
  const { loadGameSession, updatePlayerScores, nextPlayer, endRound } = useGameSession();
  const [gameSession, setGameSession] = useState<GameSession | undefined>(undefined);
  const [playerSessions, setPlayerSessions] = useState<{session: PlayerGameSession, player: Player | undefined}[]>([]);
  const [editingCell, setEditingCell] = useState<{
    playerUuid: string;
    field: "cp" | "sp" | "vp";
    value: string;
  } | null>(null);
  const middleIndex = Math.floor(playerSessions.length / 2);

  useEffect(() => {
    if (params.sessionId) {
      const { gameSession, playerGameSessions } = loadGameSession(params.sessionId);
      setGameSession(gameSession);
      setPlayerSessions(playerGameSessions);
    }
  }, []);

  const startEdit = (session: PlayerGameSession, field: "cp" | "sp" | "vp") => {
    setEditingCell({
      playerUuid: session.playerUuid,
      field,
      value: String(session[field]),
    });
  };

  const commitEdit = () => {
    if (!editingCell || !gameSession) {
      setEditingCell(null);
      return;
    }

    const current = playerSessions.find(
      ({ session }) => session.playerUuid === editingCell.playerUuid
    );

    if (!current) {
      setEditingCell(null);
      return;
    }

    const parsed = Number(editingCell.value);
    const nextValue = Number.isFinite(parsed) ? parsed : current.session[editingCell.field];
    const nextSession = { ...current.session, [editingCell.field]: nextValue };

    updatePlayerScores(nextSession, nextSession.cp, nextSession.sp, nextSession.vp);

    setPlayerSessions((prev) =>
      prev.map(({ session, player }) =>
        session.playerUuid === editingCell.playerUuid
          ? { player, session: { ...session, [editingCell.field]: nextValue } }
          : { player, session }
      )
    );

    setEditingCell(null);
  };

  const renderScoreCell = (session: PlayerGameSession, field: "cp" | "sp" | "vp", index: number) => {
    const isEditing =
      editingCell?.playerUuid === session.playerUuid && editingCell.field === field;

    if (isEditing) {
      return (
        <td className="text-center">
          <input
            className="bg-gray-200 p-2 rounded text-center m-auto "
            value={editingCell.value}
            onChange={(event) =>
              setEditingCell((prev) =>
                prev ? { ...prev, value: event.target.value } : prev
              )
            }
            onBlur={commitEdit}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.currentTarget.blur();
              }
              if (event.key === "Escape") {
                setEditingCell(null);
              }
            }}
            autoFocus
          />
        </td>
      );
    }

    return (
      <td
        className={"p-2 text-center hover:bg-gray-100 rounded-l " + (index === gameSession?.currentPlayerIndex ? "bg-green-300" : "")}
        onClick={() => startEdit(session, field)}
        style={{ cursor: "pointer" }}
      >
        {session[field]}
      </td>
    );
  };

  return (
    <main style={{ padding: "2rem" }}>
      <table className="text-3xl">
        <thead>
          <tr>
            {playerSessions.map(({ player, session }, index) => (
              <Fragment key={session.playerUuid}>
                {index === middleIndex && <th className="min-w-sm text-center">Round {gameSession?.currentRound}</th>}
                <th className={"min-w-md text-center " + (index === gameSession?.currentPlayerIndex ? "bg-green-300" : "")}>
                  {player?.name}
                </th>
              </Fragment>
            ))}
            {playerSessions.length === 0 && <th>Round {gameSession?.currentRound}</th>}
          </tr>
        </thead>
        <tbody>
          <tr>
            {playerSessions.map(({ session }, index) => (
              <Fragment key={session.playerUuid}>
                {index === middleIndex && <td className="text-center font-semibold">CP</td>}
                {renderScoreCell(session, "cp", index)}
              </Fragment>
            ))}
            {playerSessions.length === 0 && <td className="text-center font-semibold">CP</td>}
          </tr>
          <tr>
            {playerSessions.map(({ session }, index) => (
              <Fragment key={session.playerUuid}>
                {index === middleIndex && <td className="text-center font-semibold">SP</td>}
                {renderScoreCell(session, "sp", index)}
              </Fragment>
            ))}
            {playerSessions.length === 0 && <td className="text-center font-semibold">SP</td>}
          </tr>
          <tr>
            {playerSessions.map(({ session }, index) => (
              <Fragment key={session.playerUuid}>
                {index === middleIndex && <td className="text-center font-semibold">VP</td>}
                {renderScoreCell(session, "vp", index)}
              </Fragment>
            ))}
            {playerSessions.length === 0 && <td className="text-center font-semibold">VP</td>}
          </tr>
          <tr>
            {playerSessions.map(({ session }, index) => (
              <Fragment key={session.playerUuid}>
                {index === middleIndex && <td></td>}
                <td className="text-center">Total: {session.cp + session.sp + session.vp}</td>
              </Fragment>
            ))}
            {playerSessions.length === 0 && <td className="text-center font-semibold">CP</td>}
          </tr>
        </tbody>
      </table>
      <hr />
      <div className="mt-4 space-x-4">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            if (gameSession) {
              const updatedSession = nextPlayer(gameSession, playerSessions.map(ps => ps.session));
              setGameSession({ ...updatedSession });
            }
          }}
          disabled={!!gameSession?.endedAt}
        >
          Next Player
        </button>
      </div>
    </main>
  );
};

export default GameSessionPage;
