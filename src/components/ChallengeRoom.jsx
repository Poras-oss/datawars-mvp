import React, { useState, useEffect } from 'react'
import { useWebSocket } from '../WebSocketContext'
import { Moon, Sun, Maximize2, Trophy, Users } from 'lucide-react'
import CodeEditor from './CodeEditor'
import Timer from './Timer'
import PlayerCard from './PlayerCard'

const DEFAULT_STARTER_CODE = {
  python: `def twoSum(nums, target):
    # Write your code here
    pass`,
  javascript: `function twoSum(nums, target) {
    // Write your code here
}`,
  java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[]{};
    }
}`
}

function ChallengeRoom({ roomId, playerName }) {
  const [problem, setProblem] = useState(null)
  const [code, setCode] = useState('')
  const [output, setOutput] = useState(null)
  const [loading, setLoading] = useState(false)
  const [players, setPlayers] = useState({
    player1: { name: playerName, avatar: '/placeholder.svg?height=40&width=40', score: 0 },
    player2: { name: 'Waiting for opponent...', avatar: '/placeholder.svg?height=40&width=40', score: 0 }
  })
  const [selectedLanguage, setSelectedLanguage] = useState('python')
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [gameStatus, setGameStatus] = useState('waiting')
  const [error, setError] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutes in seconds
  const socket = useWebSocket()

  useEffect(() => {
    if (!socket) return;

    console.log('Emitting joinRoom event:', { roomId, playerId: playerName });
    socket.emit('joinRoom', { roomId, playerId: playerName })

    const handleRoomUpdate = (data) => {
      console.log('Room updated:', data);
      setGameStatus(data.status);
      if (data.players && data.players.length > 0) {
        const opponent = data.players.find(p => p !== playerName);
        setPlayers(prev => ({
          player1: { 
            ...prev.player1, 
            name: playerName,
            score: data.scores?.[playerName] || 0
          },
          player2: { 
            ...prev.player2, 
            name: opponent || 'Waiting for opponent...',
            score: data.scores?.[opponent] || 0
          }
        }));
      }
    }

    const handleGameStart = (data) => {
      console.log('gameStart event received:', data);
      setGameStatus('playing');
      if (data.players && data.players.length === 2) {
        const [player1, player2] = data.players;
        setPlayers({
          player1: { 
            name: player1, 
            avatar: '/placeholder.svg?height=40&width=40', 
            score: data.scores?.[player1] || 0 
          },
          player2: { 
            name: player2, 
            avatar: '/placeholder.svg?height=40&width=40', 
            score: data.scores?.[player2] || 0 
          }
        });
      }
    }

    const handleJoineeGameStart = (data) => {
      console.log('gameStart event received:', data);
      setGameStatus('playing');
      if (data.players && data.players.length === 2) {
        const opponent = data.players.find(p => p !== playerName);
        setPlayers(prev => ({
          player1: { ...prev.player1, name: playerName, score: data.scores?.[playerName] || 0 },
          player2: { ...prev.player2, name: opponent, score: data.scores?.[opponent] || 0 }
        }));
      }
    }

    const handleScoreUpdate = (data) => {
      console.log('Score update received:', data);
      setPlayers(prev => ({
        player1: { ...prev.player1, score: data.scores[playerName] || prev.player1.score },
        player2: { ...prev.player2, score: data.scores[prev.player2.name] || prev.player2.score }
      }));
    }

    const handleGameOver = (results) => {
      console.log('Game over:', results);
      setGameStatus('finished');
      setPlayers(prev => ({
        player1: { ...prev.player1, score: results.scores[playerName] || prev.player1.score },
        player2: { ...prev.player2, score: results.scores[prev.player2.name] || prev.player2.score }
      }));
    }

    socket.on('roomUpdate', handleRoomUpdate)
    socket.on('gameStart', handleGameStart)
    socket.on('scoreUpdate', handleScoreUpdate)
    socket.on('gameOver', handleGameOver)
    socket.on('roomUpdate', handleJoineeGameStart)

    return () => {
      socket.off('roomUpdate', handleRoomUpdate)
      socket.off('gameStart', handleGameStart)
      socket.off('scoreUpdate', handleScoreUpdate)
      socket.off('gameOver', handleGameOver)
      socket.off('roomUpdate', handleJoineeGameStart)
    }
  }, [socket, roomId, playerName])

  useEffect(() => {
    fetch('http://localhost:3000/api/challenges/two-sum')
      .then(res => res.json())
      .then(data => {
        const problemData = Array.isArray(data) ? data[0] : data
        setProblem(problemData)
        setCode(DEFAULT_STARTER_CODE[selectedLanguage] || '')
      })
      .catch(err => {
        console.error('Error fetching problem:', err)
        setError('Failed to fetch the challenge. Please try again.')
      })
  }, [selectedLanguage])

  const handleCodeSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:3000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language: selectedLanguage,
          challengeId: problem.id,
          roomId,
          playerId: playerName
        }),
      })

      const result = await response.json()
      setOutput(result)
      
      if (result.success) {
        socket?.emit('codeSubmitted', {
          roomId,
          playerId: playerName,
          result
        })
      }
    } catch (err) {
      setError('Failed to submit code. Please try again.')
      console.error('Error submitting code:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!problem) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading challenge...</p>
        </div>
      </div>
    )
  }

  if (gameStatus === 'waiting') {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-pulse rounded-full h-12 w-12 bg-blue-500 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">
            {players.player2.name === 'Waiting for opponent...' 
              ? 'Waiting for opponent to join...'
              : 'Opponent joined! Game starting soon...'}
          </h2>
          <p className="text-gray-400">Room ID:</p>
          <div className="bg-gray-800 rounded-lg px-4 py-2 mt-2 font-mono text-white">
            {roomId}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-900">
      {/* Left Sidebar */}
      <div className="w-16 border-r border-gray-800 flex flex-col items-center py-4 space-y-6">
        <button 
          className="p-2 rounded hover:bg-gray-800"
          onClick={() => socket?.emit('requestLeaderboard', { roomId })}
        >
          <Trophy className="w-6 h-6 text-gray-400" />
        </button>
        <button className="p-2 rounded hover:bg-gray-800">
          <Users className="w-6 h-6 text-gray-400" />
        </button>
        <button 
          className="p-2 rounded hover:bg-gray-800"
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6 text-gray-400" />
          ) : (
            <Moon className="w-6 h-6 text-gray-400" />
          )}
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Problem Description */}
        <div className="w-1/3 p-6 border-r border-gray-800 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white mb-4">{problem.title}</h1>
          <div className="prose prose-invert">
            <p className="text-gray-300">{problem.description}</p>
            {problem.constraints && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-white mb-2">Constraints:</h3>
                <ul className="list-disc pl-4 text-gray-300">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>{constraint}</li>
                  ))}
                </ul>
              </div>
            )}
            {problem.examples?.map((example, index) => (
              <div key={index} className="mt-4 p-4 bg-gray-800 rounded-lg">
                <p className="font-mono text-sm text-gray-300">
                  Input: {example.input}
                  <br />
                  Output: {example.output}
                  {example.explanation && (
                    <>
                      <br />
                      Explanation: {example.explanation}
                    </>
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Code Editor */}
        <div className="flex-1 flex flex-col">
          <div className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
            <div className="flex items-center space-x-4">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="bg-gray-800 text-white rounded px-3 py-1"
              >
                <option value="python">Python</option>
                <option value="javascript">JavaScript</option>
                <option value="java">Java</option>
              </select>
              <Timer 
                initialTime={timeLeft} 
                isRunning={gameStatus === 'playing'} 
                onTimeUp={() => socket?.emit('timeUp', { roomId, playerId: playerName })}
              />
            </div>
            <div className="flex items-center space-x-4">
              <PlayerCard player={players.player1} />
              <span className="text-gray-400">vs</span>
              <PlayerCard player={players.player2} />
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

          <div className="h-48 border-t border-gray-800">
            <div className="flex items-center justify-between px-6 py-3 border-b border-gray-800">
              <h3 className="text-white font-semibold">Output</h3>
              <button
                onClick={handleCodeSubmit}
                disabled={loading || gameStatus !== 'playing'}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Running...' : 'Run Code'}
              </button>
            </div>
            <div className="p-4 font-mono text-sm">
              {error && (
                <div className="bg-red-500 bg-opacity-10 text-red-500 p-3 rounded">
                  {error}
                </div>
              )}
              {output && (
                <div className={`p-3 rounded ${output.success ? 'bg-green-500 bg-opacity-10 text-green-500' : 'bg-red-500 bg-opacity-10 text-red-500'}`}>
                  {output.success ? '✓ All test cases passed!' : `✗ ${output.error}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {gameStatus === 'finished' && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-900 p-8 rounded-xl text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Game Over!</h2>
            <div className="flex items-center justify-center space-x-8">
              <PlayerCard player={players.player1} showScore />
              <span className="text-gray-400 text-2xl">vs</span>
              <PlayerCard player={players.player2} showScore />
            </div>
            <button
              onClick={() => window.location.href = '/'}
              className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChallengeRoom

