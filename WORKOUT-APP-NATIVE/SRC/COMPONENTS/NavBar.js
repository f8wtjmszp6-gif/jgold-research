import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import Svg, { Rect, Line, Polyline } from 'react-native-svg'
import { C } from '../colors'

function CalendarIcon({ color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <Rect x="3" y="4" width="18" height="18" rx="2" />
      <Line x1="16" y1="2" x2="16" y2="6" />
      <Line x1="8" y1="2" x2="8" y2="6" />
      <Line x1="3" y1="10" x2="21" y2="10" />
    </Svg>
  )
}

function ChartIcon({ color }) {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </Svg>
  )
}

export default function NavBar({ screen, setScreen }) {
  const insets = useSafeAreaInsets()
  const isSchedule = screen === 'home' || screen === 'day'
  const isProgram = screen === 'program'

  return (
    <View style={[s.bar, { paddingBottom: insets.bottom || 12 }]}>
      <Pressable style={s.btn} onPress={() => setScreen('home')}>
        <CalendarIcon color={isSchedule ? C.orange : C.zinc500} />
        <Text style={[s.label, isSchedule && s.active]}>Schedule</Text>
      </Pressable>
      <Pressable style={s.btn} onPress={() => setScreen('program')}>
        <ChartIcon color={isProgram ? C.orange : C.zinc500} />
        <Text style={[s.label, isProgram && s.active]}>Program</Text>
      </Pressable>
    </View>
  )
}

const s = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    backgroundColor: '#0f0f0f',
    borderTopWidth: 1,
    borderTopColor: C.zinc800,
    paddingTop: 10,
  },
  btn: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '500',
    color: C.zinc500,
  },
  active: {
    color: C.orange,
  },
})
