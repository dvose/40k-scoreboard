import './App.css'
import { Route, Routes } from 'react-router'
import CreateEditGameSessionPage from './pages/CreateEditGameSessionPage'
import HomePage from './pages/HomePage'
import GameSessionPage from './pages/GameSessionPage'
import GameSessionsHistoryPage from './pages/GameSessionsHistoryPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/game-sessions" element={<GameSessionsHistoryPage />} />
      <Route path="/game-sessions/new" element={<CreateEditGameSessionPage />} />
      <Route path="/game-sessions/:sessionId" element={<GameSessionPage />} />
      <Route
        path="/game-sessions/:sessionId/edit"
        element={<CreateEditGameSessionPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Routes>
  )
}

export default App
