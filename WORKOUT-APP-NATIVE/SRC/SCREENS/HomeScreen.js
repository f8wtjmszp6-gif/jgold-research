import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { schedule, DAYS } from '../data/workout'
import { C } from '../colors'

const DAY_COLORS = {
  lift: C.orange,
  otf: '#dc2626',
  walk: '#16a34a',
}

const DAY_ICONS = {
  lift: '🏋️',
  otf: '🔥',
  walk: '🚶',
}

const WEEK_INSTRUCTIONS = {
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

export default function HomeScreen({ onSelectDay, currentWeek, store, onSignOut }) {
  const insets = useSafeAreaInsets()
  const today = store.getTodayKey()
  const allDays = [...DAYS, 'saturday']

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 16 }]}>
        <View style={s.headerRow}>
          <View>
            <Text style={s.title}>My Workouts</Text>
            <Text style={s.subtitle}>Week {currentWeek} of 12</Text>
          </View>
          <Pressable onPress={onSignOut} style={({ pressed }) => [s.signOutBtn, pressed && { opacity: 0.6 }]}>
            <Text style={s.signOutText}>Sign Out</Text>
          </Pressable>
        </View>
      </View>

      <View style={s.badge}>
        <View style={s.badgeInner}>
          <View>
            <Text style={s.badgeLabel}>THIS WEEK</Text>
            <Text style={s.badgeInstruction}>{WEEK_INSTRUCTIONS[currentWeek]}</Text>
          </View>
          <View style={s.weekCircle}>
            <Text style={s.weekNum}>{currentWeek}</Text>
          </View>
        </View>
      </View>

      <ScrollView style={s.list} contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
        {allDays.map(day => {
          const d = schedule[day]
          if (!d) return null
          const isToday = today === day
          const count = d.exercises.length
          const done = d.exercises.filter(e => store.getChecked(day, 'exercises', e.id)).length
          const isWalk = d.type === 'walk'
          const color = DAY_COLORS[d.type]

          return (
            <Pressable
              key={day}
              onPress={() => !isWalk && onSelectDay(day)}
              style={({ pressed }) => [
                s.dayCard,
                isToday && s.dayCardToday,
                pressed && !isWalk && { opacity: 0.8, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={[s.iconBox, { backgroundColor: color }]}>
                <Text style={s.icon}>{DAY_ICONS[d.type]}</Text>
              </View>
              <View style={s.dayBody}>
                <View style={s.dayRow}>
                  <Text style={s.dayLabel}>{d.label}</Text>
                  {isToday && <View style={s.todayBadge}><Text style={s.todayText}>Today</Text></View>}
                </View>
                <Text style={s.dayName}>{d.name}</Text>
              </View>
              {count > 0 && (
                <View style={s.progress}>
                  <Text style={s.progressText}>{done}/{count}</Text>
                  <View style={s.bar}>
                    <View style={[s.barFill, { width: `${count ? (done / count) * 100 : 0}%`, backgroundColor: color }]} />
                  </View>
                </View>
              )}
            </Pressable>
          )
        })}
      </ScrollView>
    </View>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  signOutBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: C.card,
    borderRadius: 10,
    marginTop: 4,
  },
  signOutText: {
    color: C.zinc400,
    fontSize: 13,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: C.white,
  },
  subtitle: {
    fontSize: 13,
    color: C.zinc400,
    marginTop: 4,
  },
  badge: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  badgeInner: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeLabel: {
    fontSize: 10,
    color: C.zinc500,
    letterSpacing: 1,
    marginBottom: 4,
  },
  badgeInstruction: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
  weekCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: C.orangeBg,
    borderWidth: 1,
    borderColor: C.orangeBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNum: {
    fontSize: 20,
    fontWeight: '700',
    color: C.orange,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 10,
  },
  dayCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    gap: 12,
  },
  dayCardToday: {
    borderWidth: 2,
    borderColor: C.orange,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 20,
  },
  dayBody: {
    flex: 1,
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dayLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
  todayBadge: {
    backgroundColor: C.orange,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  todayText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
  },
  dayName: {
    fontSize: 13,
    color: C.zinc400,
    marginTop: 2,
  },
  progress: {
    alignItems: 'flex-end',
  },
  progressText: {
    fontSize: 13,
    fontWeight: '500',
    color: C.zinc300,
    marginBottom: 4,
  },
  bar: {
    width: 64,
    height: 4,
    backgroundColor: C.zinc700,
    borderRadius: 2,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: 2,
  },
})
