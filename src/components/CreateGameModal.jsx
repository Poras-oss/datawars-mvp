import { useState } from 'react'

function CreateGameModal({ mode, onClose, onStart }) {
  const [name, setName] = useState('')
  const [gameId, setGameId] = useState('')

  const handleCreateGame = () => {
    // In a real app, you would make an API call to create a game
    const newGameId = Math.random().toString(36).substring(7)
    onStart(newGameId)
  }

  const handleJoinGame = () => {
    if (gameId) {
      onStart(gameId)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-900 p-6 rounded-xl w-96">
        <h3 className="text-xl font-bold mb-4">
          <span className="text-yellow-500">⚡</span> {mode.title} Challenge
        </h3>
        
        <input
          type="text"
          placeholder="Enter your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 bg-gray-800 rounded-lg mb-4"
        />

        <button
          onClick={handleCreateGame}
          className="w-full py-2 bg-blue-500 rounded-lg mb-4 hover:bg-blue-600 transition-colors"
        >
          Create Game ({mode.duration})
        </button>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Enter Game ID"
            value={gameId}
            onChange={(e) => setGameId(e.target.value)}
            className="flex-1 px-4 py-2 bg-gray-800 rounded-lg"
          />
          <button
            onClick={handleJoinGame}
            className="px-4 py-2 bg-purple-500 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Join
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default CreateGameModal

