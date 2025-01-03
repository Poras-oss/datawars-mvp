import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import ChallengeRoom from './components/ChallengeRoom'
import Navbar from './components/Navbar'
import './App.css'
import { WebSocketProvider } from './WebSocketContext'

function App() {
  const [userStats, setUserStats] = useState({
    level: 5,
    xp: 0,
    energy: 100,
    power: 100,
    speed: 100,
    ability: 100,
    dailyGoals: {
      current: 3,
      total: 5
    },
    streak: {
      current: 2,
      total: 3
    },
    weeklyAchievements: {
      current: 5,
      total: 7
    }
  })

  return (
    <WebSocketProvider>
      <BrowserRouter>
        <div className="app bg-[#0f1117] min-h-screen text-white">
          <Navbar userStats={userStats} />
          <div className="w-full">
            <Routes>
              <Route path="/" element={<Dashboard userStats={userStats} />} />
              <Route path="/challenge/:mode" element={<ChallengeRoom />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </WebSocketProvider>
  )
}

export default App

