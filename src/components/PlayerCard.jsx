function PlayerCard({ player, time }) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center">
          <img
            src={player.avatar}
            alt={`${player.name}'s avatar`}
            className="w-12 h-12 rounded-full bg-gray-700"
          />
          <span className="mt-1 text-sm">{player.name}</span>
        </div>
        <div className="text-2xl font-mono">{time}</div>
      </div>
    )
  }
  
  export default PlayerCard
  
  