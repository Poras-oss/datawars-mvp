import React, { useState, useEffect } from 'react'
import { useWebSocket } from '../WebSocketContext'

function CreateGameModal({ mode, challenges, onClose, onStart }) {
  const [name, setName] = useState('')
  const [gameId, setGameId] = useState('')
  const [error, setError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const socket = useWebSocket()

  useEffect(() => {
    if (!socket) return;

    const handleRoomCreated = (data) => {
      console.log('Room created event received:', data)
      setIsCreating(false)
      if (data && data.roomId) {
        onStart(data.roomId, name)
      } else {
        setError('Invalid room data received')
      }
    }

    const handleJoinedRoom = (data) => {
      console.log('Joined room event received:', data)
      setIsCreating(false)
      if (data && data.roomId) {
        onStart(data.roomId, name)
      } else {
        setError('Invalid room data received')
      }
    }

    const handleError = (data) => {
      console.error('Socket error:', data)
      setError(data.message || 'An error occurred')
      setIsCreating(false)
    }

    socket.on('roomCreated', handleRoomCreated)
    socket.on('joinedRoom', handleJoinedRoom)
    socket.on('error', handleError)

    return () => {
      socket.off('roomCreated', handleRoomCreated)
      socket.off('joinedRoom', handleJoinedRoom)
      socket.off('error', handleError)
    }
  }, [socket, onStart, name])

  const handleCreateGame = () => {
    if (!name.trim()) {
      setError('Please enter your name')
      return
    }

    if (socket) {
      setIsCreating(true)
      setError('')
      console.log('Emitting createRoom event with playerId:', name)
      
      socket.emit('createRoom', {
        playerId: name,
        challengeId: 'two-sum',
        mode: mode.title
      })
    } else {
      setError('WebSocket connection not established')
    }
  }

  const handleJoinGame = () => {
    if (!name.trim() || !gameId.trim()) {
      setError('Please enter both your name and the game ID')
      return
    }

    if (socket) {
      setIsCreating(true)
      setError('')
      console.log('Emitting joinRoom event:', { roomId: gameId, playerId: name })
      
      socket.emit('joinRoom', {
        roomId: gameId,
        playerId: name
      })
    } else {
      setError('WebSocket connection not established')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-96">
        <h3 className="text-xl font-bold mb-4 text-white">
          <span className="text-yellow-500">⚡</span> {mode.title} Challenge
        </h3>
        
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg mb-4 text-white"
          disabled={isCreating}
        />

        <button
          onClick={handleCreateGame}
          disabled={isCreating || !name.trim()}
          className="w-full py-2 bg-blue-500 rounded-lg mb-4 hover:bg-blue-600 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCreating ? 'Creating Game...' : 'Create Game'}
        </button>

        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900 text-gray-400">OR</span>
          </div>
        </div>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 rounded-lg text-white"
            disabled={isCreating}
          />
          <button
            onClick={handleJoinGame}
            disabled={isCreating || !name.trim() || !gameId.trim()}
            className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating ? 'Joining...' : 'Join'}
          </button>
        </div>

        {error && (
          <div className="bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-3 mb-4">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        <button
          onClick={onClose}
          disabled={isCreating}
          className="w-full py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default CreateGameModal

