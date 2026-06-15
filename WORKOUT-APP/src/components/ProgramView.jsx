import { twelveWeekProgram, progressionRules, coreProgression } from '../data/workout'

export default function ProgramView({ currentWeek, onSetWeek }) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-4">
        <h1 className="text-2xl font-bold text-white">12-Week Program</h1>
        <p className="text-zinc-400 text-sm mt-1">Tap a week to set it as current</p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-6">
        {/* Week selector */}
        <div className="space-y-2">
          {twelveWeekProgram.map(({ week, instruction, detail }) => {
            const isCurrent = week === currentWeek
            const isPast = week < currentWeek
            return (
              <button
                key={week}
                onClick={() => onSetWeek(week)}
                className={`w-full text-left rounded-2xl p-4 transition-all active:scale-95 ${
                  isCurrent
                    ? 'bg-orange-500/15 border border-orange-500/50'
                    : isPast
                    ? 'bg-zinc-900/50 opacity-60'
                    : 'bg-zinc-900'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold ${
                    isCurrent ? 'bg-orange-500 text-white' : isPast ? 'bg-zinc-700 text-zinc-400' : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {week}
                  </div>
                  <div>
                    <p className={`font-semibold ${isCurrent ? 'text-orange-400' : 'text-white'}`}>{instruction}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{detail}</p>
                  </div>
                  {isCurrent && (
                    <span className="ml-auto text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full shrink-0">Current</span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Progression Rules */}
        <Section title="Weight Progression Rules">
          <p className="text-zinc-500 text-xs mb-3">Applied at weeks 5 & 9</p>
          {progressionRules.map(r => (
            <div key={r.category} className="bg-zinc-900 rounded-xl p-3 mb-2">
              <p className="text-white text-sm font-semibold">{r.category}</p>
              <p className="text-zinc-500 text-xs mt-0.5">{r.exercises}</p>
              <p className="text-orange-400 text-sm mt-1 font-medium">{r.rule}</p>
            </div>
          ))}
          <div className="bg-zinc-900 rounded-xl p-3 mt-1">
            <p className="text-zinc-400 text-xs">💡 Barbell upper body adds 2.5 lbs per side — fractional plates recommended</p>
          </div>
        </Section>

        {/* Core Progression */}
        <Section title="Core Progression">
          {coreProgression.map(c => (
            <div key={c.exercise} className="bg-zinc-900 rounded-xl p-3 mb-2">
              <p className="text-white text-sm font-semibold">{c.exercise}</p>
              <p className="text-zinc-400 text-xs mt-1">{c.rule}</p>
            </div>
          ))}
        </Section>

        {/* After Week 12 */}
        <Section title="After Week 12">
          <div className="bg-zinc-900 rounded-xl p-4">
            <p className="text-white text-sm font-semibold mb-2">Restart the Cycle</p>
            <p className="text-zinc-400 text-sm">Begin cycle 2 at the weight used in <span className="text-orange-400 font-medium">week 9 of the previous cycle</span>. That is your new starting baseline.</p>
          </div>
        </Section>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-white font-bold text-base mb-3">{title}</h2>
      {children}
    </div>
  )
}
