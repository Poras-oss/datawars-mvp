import { useState, useEffect } from 'react'

function Timer({ initialTime = 1800 }) { // 30 minutes in seconds
  const [time, setTime] = useState(initialTime)

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(timer)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const minutes = Math.floor(time / 60)
  const seconds = time % 60

  return (
    <div className="font-mono">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  )
}

export default Timer

