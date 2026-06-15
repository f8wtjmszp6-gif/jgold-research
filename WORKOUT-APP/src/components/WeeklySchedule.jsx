import { schedule, DAYS } from '../data/workout'

const dayColors = {
  lift: 'bg-orange-500',
  otf: 'bg-red-600',
  walk: 'bg-emerald-600',
}

const dayIcons = {
  lift: '🏋️',
  otf: '🔥',
  walk: '🚶',
}

export default function WeeklySchedule({ onSelectDay, currentWeek, store }) {
  const today = store.getTodayKey()

  const allDays = [...DAYS, 'saturday']

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white">My Workouts</h1>
        <p className="text-zinc-400 text-sm mt-1">Week {currentWeek} of 12</p>
      </div>

      <div className="px-4 mb-4">
        <WeekBadge week={currentWeek} />
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-3">
        {allDays.map(day => {
          const d = schedule[day]
          if (!d) return null
          const isToday = today === day
          const exerciseCount = d.exercises.length
          const completed = d.exercises.filter(e => store.getChecked(day, 'exercises', e.id)).length

          return (
            <button
              key={day}
              onClick={() => d.type !== 'walk' && onSelectDay(day)}
              className={`w-full text-left rounded-2xl p-4 transition-all active:scale-95 ${
                isToday ? 'ring-2 ring-orange-500' : ''
              } ${d.type === 'walk' ? 'bg-zinc-900 cursor-default' : 'bg-zinc-900 hover:bg-zinc-800'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${dayColors[d.type]}`}>
                    {dayIcons[d.type]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white">{d.label}</span>
                      {isToday && (
                        <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">Today</span>
                      )}
                    </div>
                    <span className="text-sm text-zinc-400">{d.name}</span>
                  </div>
                </div>
                {exerciseCount > 0 && (
                  <div className="text-right">
                    <span className="text-sm font-medium text-zinc-300">{completed}/{exerciseCount}</span>
                    <div className="w-16 h-1.5 bg-zinc-700 rounded-full mt-1">
                      <div
                        className="h-full bg-orange-500 rounded-full transition-all"
                        style={{ width: `${exerciseCount ? (completed / exerciseCount) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function WeekBadge({ week }) {
  const instructions = {
    1: 'Low end of rep range',
    2: '+1 rep per set',
    3: '+1 rep per set',
    4: 'Hit top of rep range',
    5: 'Drop reps + add weight',
    6: '+1 rep per set',
    7: '+1 rep per set',
    8: 'Hit top of rep range',
    9: 'Drop reps + add weight',
    10: '+1 rep per set',
    11: 'Hit top of rep range',
    12: 'Deload — 2 sets, -30% weight',
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">This Week</p>
          <p className="text-white font-semibold">{instructions[week]}</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
          <span className="text-orange-400 font-bold text-lg">{week}</span>
        </div>
      </div>
    </div>
  )
}
