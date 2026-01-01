import { usePlayerStore } from "../hooks/stores/playerStore";
import {v4 as uuidv4} from "uuid";
import { useEffect, useState } from "react";

type PlayerPickerProps = {
  excludeUuids?: string[];
  label?: string;
  onSelect?: (playerUuid: string | undefined) => void;
  createNew?: boolean;
};

const PlayerPicker = (props: PlayerPickerProps) => {
  const players = usePlayerStore((state) => state.players);
  const addPlayer = usePlayerStore((state) => state.addPlayer);
  const [selectedPlayerUuid, setSelectedPlayerUuid] = useState<string | undefined>(undefined);
  const [name, setName] = useState("");
  const [addingPlayer, setAddingPlayer] = useState(false);
  const filteredPlayers = props.excludeUuids
    ? players.filter((p) => !props.excludeUuids?.includes(p.uuid))
    : players;

  const onAddPlayer = () => {
    if (!name) {
      return;
    }
    const uuid = uuidv4();
    addPlayer({ uuid, name });
    setSelectedPlayerUuid(uuid);
    setName("");
    setAddingPlayer(false);
    props.onSelect?.(uuid);
  };

  const onToggleAddPlayer = () => {
    setAddingPlayer(!addingPlayer);
  };

  useEffect(() => {
    if (props.excludeUuids && props.excludeUuids.includes(selectedPlayerUuid || "")) {
      setSelectedPlayerUuid(undefined);
    }
  }, [props.excludeUuids, setSelectedPlayerUuid, selectedPlayerUuid])

  return (
    <div className="rounded-xl shadow-lg p-6 border border-gray-200 mb-4">
      <select className={addingPlayer ? "hidden" : "bg-gray-100 border border-gray-200 rounded-lg p-2"}>
        <option
          value={selectedPlayerUuid}
          onClick={() => {
            setSelectedPlayerUuid(undefined);
            props.onSelect?.(undefined);
          }}
        >
          Select {props.label}
        </option>
        {filteredPlayers.map((player) => (
          <option
            key={player.uuid}
            value={player.uuid}
            selected={player.uuid === selectedPlayerUuid}
            onClick={() => {
              setSelectedPlayerUuid(player.uuid);
              props.onSelect?.(player.uuid);
            }}
          >
            {player.name}
          </option>
        ))}
      </select>
      {props.createNew && !addingPlayer && (
        <button
          className="
          text-sm hover:cursor-pointer
          border-blue-300 border rounded-3xl text-blue-500 py-2 px-3 ml-4
          hover:bg-blue-500 hover:border-transparent hover:text-white"
          onClick={onToggleAddPlayer}
        >
          New Player
        </button>
      )}
      {addingPlayer && (
        <div className="flex flex-wrap gap-4">
          <div className="flex">
            <input
              className="bg-gray-100 border border-gray-200 rounded-lg p-2"
              type="text"
              placeholder="Enter player name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="flex">
            <button
              className="
              text-sm hover:cursor-pointer
              border-red-500 border rounded-3xl text-red-600 py-2 px-3 ml-4
              hover:bg-red-600 hover:border-transparent hover:text-white"
              onClick={onToggleAddPlayer}
            >
              Cancel
            </button>
            <button
              className="
              text-sm hover:cursor-pointer
              border-green-500 border rounded-3xl text-green-600 py-2 px-3 ml-4
              hover:bg-green-600 hover:border-transparent hover:text-white"
              onClick={onAddPlayer}
            >
              Create
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default PlayerPicker;