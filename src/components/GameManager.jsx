import React, { useState } from 'react'
import CreateGameModal from './CreateGameModal'
import ChallengeRoom from './ChallengeRoom'

function GameManager({ mode }) {
  const [showModal, setShowModal] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [roomId, setRoomId] = useState('')
  const [playerName, setPlayerName] = useState('')

  const handleGameStart = (newRoomId, name) => {
    console.log('Game started:', { roomId: newRoomId, playerName: name });
    setRoomId(newRoomId)
    setPlayerName(name)
    setGameStarted(true)
    setShowModal(false)
  }

  return (
    <div>
      {showModal && (
        <CreateGameModal
          mode={mode}
          onClose={() => setShowModal(false)}
          onGameStart={handleGameStart}
        />
      )}
      {gameStarted && (
        <ChallengeRoom 
          roomId={roomId} 
          playerName={playerName} 
        />
      )}
    </div>
  )
}

export default GameManager

