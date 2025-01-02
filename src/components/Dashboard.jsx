import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloudLightningIcon as Lightning, Clock, Timer, Settings } from 'lucide-react'
import ProgressBar from './ProgressBar'
import GameModeCard from './GameModeCard'
import CreateGameModal from './CreateGameModal'

function Dashboard({ userStats }) {
  const [showModal, setShowModal] = useState(false)
  const [selectedMode, setSelectedMode] = useState(null)
  const [challenges, setChallenges] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Fetch challenges from the server
    fetch('https://datawars-demo-server.vercel.app/api/challenges')
      .then(response => response.json())
      .then(data => setChallenges(data))
      .catch(error => console.error('Error fetching challenges:', error))
  }, [])

  const gameModes = [
    {
      title: 'Bullet',
      description: 'Fast-paced coding challenge',
      icon: Lightning,
      duration: '10 min',
      difficulty: 'intermediate',
      xp: 100,
      powerups: ['Time Freeze', 'Code Hint']
    },
    {
      title: 'Power Hour',
      description: 'Medium length challenge',
      icon: Clock,
      duration: '60 min',
      difficulty: 'advanced',
      xp: 150,
      powerups: ['Debug Boost', 'Energy Surge']
    },
    {
      title: 'Code Marathon',
      description: 'Extended coding session',
      icon: Timer,
      duration: '120 min',
      difficulty: 'expert',
      xp: 300,
      powerups: ['Second Wind', 'Focus Mode']
    },
    {
      title: 'Custom Challenge',
      description: 'Create your own challenge',
      icon: Settings,
      duration: 'Custom',
      difficulty: 'beginner',
      xp: 0,
      powerups: ['Customizable']
    }
  ]

  const handleStartChallenge = (mode) => {
    setSelectedMode(mode)
    setShowModal(true)
  }

  return (
    <div className="w-full p-8">
      <div className="grid grid-cols-3 gap-6 mb-8">
        <ProgressBar 
          title="Daily Goals" 
          current={userStats.dailyGoals.current} 
          total={userStats.dailyGoals.total} 
          color="bg-blue-500" 
        />
        <ProgressBar 
          title="3-Day Streak" 
          current={userStats.streak.current} 
          total={userStats.streak.total} 
          color="bg-purple-500" 
        />
        <ProgressBar 
          title="Weekly Achievements" 
          current={userStats.weeklyAchievements.current} 
          total={userStats.weeklyAchievements.total} 
          color="bg-yellow-500" 
        />
      </div>

      <h2 className="text-3xl font-bold mb-2">Choose Your Challenge</h2>
      <p className="text-gray-400 mb-8">
        Select a time challenge that matches your skill level and ambition
      </p>

      <div className="grid grid-cols-2 gap-6">
        {gameModes.map((mode) => (
          <GameModeCard 
            key={mode.title} 
            mode={mode} 
            onStart={() => handleStartChallenge(mode)} 
          />
        ))}
      </div>

      {showModal && (
        <CreateGameModal
          mode={selectedMode}
          challenges={challenges}
          onClose={() => setShowModal(false)}
          onStart={(gameId) => navigate(`/challenge/${gameId}`)}
        />
      )}
    </div>
  )
}

export default Dashboard

