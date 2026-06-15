import { useState, useEffect, useRef } from 'react'

export default function StretchTimer({ stretch, onClose }) {
  const totalSides = stretch.perSide ? 2 : 1
  const [side, setSide] = useState(1)
  const [timeLeft, setTimeLeft] = useState(stretch.duration)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            if (stretch.perSide && side === 1) {
              setTimeout(() => {
                setSide(2)
                setTimeLeft(stretch.duration)
              }, 800)
            } else {
              setDone(true)
            }
            return 0
          }
          return t - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, timeLeft, side, stretch])

  const progress = 1 - timeLeft / stretch.duration
  const circumference = 2 * Math.PI * 52

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-6">
      <div className="bg-zinc-900 rounded-3xl p-8 w-full max-w-sm">
        <h3 className="text-white font-bold text-xl text-center mb-1">{stretch.name}</h3>
        {stretch.alt && (
          <p className="text-zinc-500 text-sm text-center mb-1">Alt: {stretch.alt}</p>
        )}
        {stretch.perSide && (
          <p className="text-orange-400 text-sm text-center mb-6">
            {done ? 'Complete!' : `Side ${side} of 2`}
          </p>
        )}
        {!stretch.perSide && <div className="mb-6" />}

        <div className="flex items-center justify-center mb-8">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke="#27272a" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="52" fill="none"
                stroke={done ? '#22c55e' : '#f97316'}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - (done ? 1 : progress))}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              {done ? (
                <span className="text-4xl">✓</span>
              ) : (
                <span className="text-4xl font-bold text-white">{timeLeft}</span>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {!done && (
            <button
              onClick={() => setRunning(r => !r)}
              className="flex-1 py-4 rounded-2xl font-semibold text-white bg-orange-500 active:bg-orange-600 transition-colors"
            >
              {running ? 'Pause' : 'Start'}
            </button>
          )}
          <button
            onClick={onClose}
            className={`py-4 rounded-2xl font-semibold transition-colors ${
              done
                ? 'flex-1 bg-emerald-600 text-white active:bg-emerald-700'
                : 'px-5 bg-zinc-800 text-zinc-300 active:bg-zinc-700'
            }`}
          >
            {done ? 'Done' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  )
}
