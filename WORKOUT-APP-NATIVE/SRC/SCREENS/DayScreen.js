import { useState } from 'react'
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Path } from 'react-native-svg'
import ExerciseCard from '../components/ExerciseCard'
import StretchCard from '../components/StretchCard'
import StretchTimer from '../components/StretchTimer'
import { C } from '../colors'

export default function DayScreen({ day, dayData, store, onBack }) {
  const insets = useSafeAreaInsets()
  const [tab, setTab] = useState('exercises')
  const [activeStretch, setActiveStretch] = useState(null)

  const exerciseDone = dayData.exercises.filter(e => store.getChecked(day, 'exercises', e.id)).length
  const stretchDone = dayData.stretches.filter(s => store.getChecked(day, 'stretches', s.id)).length

  function handleReset() {
    Alert.alert('Reset Day', 'Clear all checkmarks for today?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Reset', style: 'destructive', onPress: () => store.clearDay(day) },
    ])
  }

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Pressable onPress={onBack} style={s.backBtn}>
          <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2.5">
            <Path d="M15 18l-6-6 6-6" />
          </Svg>
          <Text style={s.backText}>Schedule</Text>
        </Pressable>
        <Text style={s.title}>{dayData.label}</Text>
        <Text style={s.subtitle}>{dayData.name}</Text>
      </View>

      <View style={s.tabs}>
        <View style={s.tabBar}>
          <TabBtn active={tab === 'exercises'} onPress={() => setTab('exercises')}>
            Exercises{exerciseDone > 0 ? `  ${exerciseDone}/${dayData.exercises.length}` : ''}
          </TabBtn>
          <TabBtn active={tab === 'stretches'} onPress={() => setTab('stretches')}>
            Stretches{stretchDone > 0 ? `  ${stretchDone}/${dayData.stretches.length}` : ''}
          </TabBtn>
        </View>
      </View>

      <ScrollView style={s.list} contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
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
      </ScrollView>

      <View style={[s.footer, { paddingBottom: 16 }]}>
        <Pressable onPress={handleReset} style={({ pressed }) => [pressed && { opacity: 0.6 }]}>
          <Text style={s.resetText}>Reset day</Text>
        </Pressable>
      </View>

      {activeStretch && (
        <StretchTimer
          stretch={activeStretch}
          onClose={() => {
            if (!store.getChecked(day, 'stretches', activeStretch.id)) {
              store.toggleChecked(day, 'stretches', activeStretch.id)
            }
            setActiveStretch(null)
          }}
        />
      )}
    </View>
  )
}

function TabBtn({ active, onPress, children }) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.tabBtn, active && s.tabBtnActive]}
    >
      <Text style={[s.tabText, active && s.tabTextActive]}>{children}</Text>
    </Pressable>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  backText: {
    color: C.orange,
    fontSize: 14,
    fontWeight: '500',
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
  tabs: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  tabBar: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: C.zinc700,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '500',
    color: C.zinc500,
  },
  tabTextActive: {
    color: C.white,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: 8,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    alignItems: 'center',
  },
  resetText: {
    color: C.zinc500,
    fontSize: 14,
  },
})
