import { useState } from 'react'
import StretchTimer from './StretchTimer'

export default function DayDetail({ day, dayData, store, onBack }) {
  const [activeStretch, setActiveStretch] = useState(null)
  const [tab, setTab] = useState('exercises')

  const exerciseDone = dayData.exercises.filter(e => store.getChecked(day, 'exercises', e.id)).length
  const stretchDone = dayData.stretches.filter(s => store.getChecked(day, 'stretches', s.id)).length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-6 pb-4">
        <button onClick={onBack} className="flex items-center gap-2 text-orange-400 mb-4 active:opacity-70">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
          <span className="text-sm font-medium">Schedule</span>
        </button>
        <h1 className="text-2xl font-bold text-white">{dayData.label}</h1>
        <p className="text-zinc-400 text-sm mt-1">{dayData.name}</p>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="bg-zinc-900 rounded-xl p-1 flex">
          <TabBtn active={tab === 'exercises'} onClick={() => setTab('exercises')}>
            Exercises {exerciseDone > 0 && <span className="ml-1 text-orange-400">({exerciseDone}/{dayData.exercises.length})</span>}
          </TabBtn>
          <TabBtn active={tab === 'stretches'} onClick={() => setTab('stretches')}>
            Stretches {stretchDone > 0 && <span className="ml-1 text-orange-400">({stretchDone}/{dayData.stretches.length})</span>}
          </TabBtn>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2">
        {tab === 'exercises' && dayData.exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            checked={store.getChecked(day, 'exercises', exercise.id)}
            onToggle={() => store.toggleChecked(day, 'exercises', exercise.id)}
          />
        ))}

        {tab === 'stretches' && dayData.stretches.map(stretch => (
          <StretchCard
            key={stretch.id}
            stretch={stretch}
            checked={store.getChecked(day, 'stretches', stretch.id)}
            onToggle={() => store.toggleChecked(day, 'stretches', stretch.id)}
            onTimer={() => setActiveStretch(stretch)}
          />
        ))}
      </div>

      {/* Reset button */}
      <div className="px-4 pb-6">
        <button
          onClick={() => store.clearDay(day)}
          className="w-full py-3 rounded-xl text-zinc-500 text-sm active:text-zinc-300 transition-colors"
        >
          Reset day
        </button>
      </div>

      {activeStretch && (
        <StretchTimer
          stretch={activeStretch}
          onClose={() => {
            store.toggleChecked(day, 'stretches', activeStretch.id)
            setActiveStretch(null)
          }}
        />
      )}
    </div>
  )
}

function TabBtn({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
        active ? 'bg-zinc-700 text-white' : 'text-zinc-500'
      }`}
    >
      {children}
    </button>
  )
}

function ExerciseCard({ exercise, checked, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`w-full text-left rounded-2xl p-4 transition-all active:scale-95 ${
        checked ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-zinc-900'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
          checked ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'
        }`}>
          {checked && (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className={`font-semibold ${checked ? 'text-orange-400 line-through' : 'text-white'}`}>
            {exercise.name}
            {exercise.perSide && <span className="text-zinc-500 font-normal text-sm ml-1">(per side)</span>}
          </p>
          <p className="text-zinc-400 text-sm mt-0.5">
            {exercise.sets} sets × {exercise.reps}
          </p>
          <p className="text-zinc-500 text-xs mt-1">{exercise.weight}</p>
        </div>
      </div>
    </button>
  )
}

function StretchCard({ stretch, checked, onToggle, onTimer }) {
  return (
    <div className={`rounded-2xl p-4 transition-all ${
      checked ? 'bg-orange-500/10 border border-orange-500/30' : 'bg-zinc-900'
    }`}>
      <div className="flex items-center gap-3">
        <button onClick={onToggle} className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 active:scale-95 transition-all">
          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            checked ? 'border-orange-500 bg-orange-500' : 'border-zinc-600'
          }`}>
            {checked && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            )}
          </div>
        </button>
        <div className="flex-1">
          <p className={`font-semibold ${checked ? 'text-orange-400' : 'text-white'}`}>{stretch.name}</p>
          <p className="text-zinc-400 text-xs mt-0.5">
            {stretch.duration}s{stretch.perSide ? ' per side' : ''}
            {stretch.alt && <span className="text-zinc-600"> · Alt: {stretch.alt}</span>}
          </p>
        </div>
        <button
          onClick={onTimer}
          className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center active:bg-orange-500/40 transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </button>
      </div>
    </div>
  )
}
