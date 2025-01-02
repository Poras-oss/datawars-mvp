'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Moon, Sun, Maximize2, Trophy, Users, GamepadIcon } from 'lucide-react'
import CodeEditor from './CodeEditor'
import Timer from './Timer'
import PlayerCard from './PlayerCard'

function ChallengeRoom() {
  const { mode } = useParams()
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState({
    player1: { name: 'You', avatar: '/placeholder.svg?height=40&width=40' },
    player2: { name: 'Kiara', avatar: '/placeholder.svg?height=40&width=40' }
  })
  const [selectedLanguage, setSelectedLanguage] = useState('python')
  const [isDarkMode, setIsDarkMode] = useState(true)

  useEffect(() => {
    // Fetch problem from API
    fetch('https://datawars-demo-server.vercel.app/api/challenges/two-sum')
      .then(res => res.json())
      .then(data => setProblem(data))
      .catch(err => console.error('Error fetching problem:', err))
  }, [])

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const response = await fetch('https://datawars-demo-server.vercel.app/api/challenges/two-sum/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          playerId: 'your-player-id'
        })
      })
      const data = await response.json()
      setOutput(data)
    } catch (error) {
      console.error('Error:', error)
      setOutput({ error: 'Failed to execute code' })
    }
    setLoading(false)
  }

  if (!problem) return null

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Left Sidebar */}
      <div className="w-16 bg-gray-900 border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
        <button className="p-2 rounded hover:bg-gray-800">
          <Trophy className="w-6 h-6" />
        </button>
        <button className="p-2 rounded hover:bg-gray-800">
          <Users className="w-6 h-6" />
        </button>
        <button className="p-2 rounded hover:bg-gray-800">
          <GamepadIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Battle Header */}
        <div className="bg-gray-900 p-4 border-b border-gray-800">
          <div className="flex items-center justify-between w-full px-4">
            <PlayerCard player={players.player1} time="29:46" />
            <span className="text-2xl font-bold text-gray-400">VS</span>
            <PlayerCard player={players.player2} time="29:46" />
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex-1 grid grid-cols-2 gap-2 p-2">
          {/* Question Panel */}
          <div className="bg-gray-900 rounded-lg p-6 overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-4">{problem.title}</h2>
              <p className="text-gray-300 mb-6">{problem.description}</p>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-2">Example 1:</h3>
              <div className="bg-gray-800 p-4 rounded-lg font-mono">
                <pre className="text-sm">
                  <code>Input: nums = [2,7,11,15], target = 9</code>
                </pre>
                <pre className="text-sm">
                  <code>Output: [0,1]</code>
                </pre>
                <p className="text-sm text-gray-400 mt-2">
                  Explanation: Because nums[0] + nums[1] == 9, we return [0, 1].
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-2">Constraints:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-1">
                {problem.constraints.map((constraint, index) => (
                  <li key={index}>{constraint}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Code Editor Panel */}
          <div className="bg-gray-900 rounded-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-800 text-white px-3 py-1 rounded-md"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
              </select>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="p-2 rounded hover:bg-gray-800"
                >
                  {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
                </button>
                <button className="p-2 rounded hover:bg-gray-800">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1">
              <CodeEditor 
                value={code} 
                onChange={setCode} 
                language={selectedLanguage}
                theme={isDarkMode ? 'vs-dark' : 'light'}
              />
            </div>
            <div className="p-4 border-t border-gray-800 flex gap-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
              >
                {loading ? 'Running...' : 'Submit Solution'}
              </button>
              <button
                onClick={() => handleSubmit(true)}
                disabled={loading}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
              >
                Test Code
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-64 bg-gray-900 border-l border-gray-800 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Games</span>
            <span>Players</span>
          </div>
          <select className="w-full bg-gray-800 text-white px-3 py-2 rounded-md">
            <option>45 min</option>
            <option>30 min</option>
            <option>60 min</option>
          </select>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
              Custom
            </button>
            <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
              Play a friend
            </button>
            <button className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700">
              Tournament
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChallengeRoom

