function GameModeCard({ mode, onStart }) {
  const difficultyColors = {
    beginner: 'text-green-500',
    intermediate: 'text-blue-500',
    advanced: 'text-purple-500',
    expert: 'text-red-500'
  }

  return (
    <div className="bg-gray-900 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">{mode.title}</h3>
        <mode.icon className="w-6 h-6 text-yellow-500" />
      </div>
      <p className="text-gray-400 mb-4">{mode.description}</p>
      
      <div className="flex items-center gap-4 mb-4">
        <span className={`${difficultyColors[mode.difficulty]}`}>
          {mode.difficulty}
        </span>
        <span className="text-gray-400">{mode.duration}</span>
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-400 mb-2">Power-ups:</p>
        <div className="flex gap-2">
          {mode.powerups.map((powerup) => (
            <span 
              key={powerup} 
              className="px-3 py-1 bg-gray-800 rounded-full text-sm"
            >
              {powerup}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <span className="text-yellow-500">★</span>
          <span>+{mode.xp} XP</span>
        </div>
        <button
          onClick={onStart}
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Start Challenge
        </button>
      </div>
    </div>
  )
}

export default GameModeCard

