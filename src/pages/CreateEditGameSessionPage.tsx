import { useState } from "react";
import PlayerPicker from "../components/PlayerPicker";
import { useGameSession } from "../hooks/useGameSession";
import { useNavigate } from "react-router";

const CreateEditGameSessionPage = () => {
  const { createGameSession } = useGameSession();
  const navigate = useNavigate();
  const [player1Uuid, setPlayer1Uuid] = useState<string | undefined>();
  const [player2Uuid, setPlayer2Uuid] = useState<string | undefined>();

  const validGame = !!player1Uuid && !!player2Uuid && player1Uuid !== player2Uuid;

  const onCreateGameSession = () => {
    if (!validGame) return;
    const uuid = createGameSession([player1Uuid, player2Uuid]);
    navigate(`/game-sessions/${uuid}`);
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h2 className="text-xl font-semibold mb-2">New Game</h2>
      <div className="columns-2 gap-4 mb-6 max-w-5xl">
        <PlayerPicker
          onSelect={setPlayer1Uuid}
          excludeUuids={player2Uuid ? [player2Uuid] : []}
          createNew
          label="Player 1"
        />
        <PlayerPicker
          onSelect={setPlayer2Uuid}
          excludeUuids={player1Uuid ? [player1Uuid] : []}
          createNew
          label="Player 2"
        />
      </div>
      <button className={validGame ? 
          "bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded" : 
          "bg-gray-300 text-gray-500 px-4 py-2 rounded"}  
          disabled={!validGame}
          onClick={onCreateGameSession}>
          Start Game
      </button>
    </main>
  );
};

export default CreateEditGameSessionPage;
