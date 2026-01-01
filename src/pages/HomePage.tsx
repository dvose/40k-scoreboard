import { Link } from "react-router";

const HomePage = () => {
  return (
    <main style={{ padding: "2rem" }}>
      <h1>40k Scoreboard</h1>
      <ul>
        <li>
          <Link to="/game-sessions/new">New Game</Link>
        </li>
        <li>
          <Link to="/game-sessions">View Game Sessions</Link>
        </li>
      </ul>
    </main>
  );
};

export default HomePage;
