import { View, Text, Pressable, StyleSheet } from 'react-native'
import Svg, { Polyline, Circle, Polyline as Poly } from 'react-native-svg'
import { C } from '../colors'

function CheckIcon() {
  return (
    <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
      <Polyline points="20 6 9 17 4 12" />
    </Svg>
  )
}

function TimerIcon() {
  return (
    <Svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke={C.orange} strokeWidth="2">
      <Circle cx="12" cy="12" r="10" />
      <Poly points="12 6 12 12 16 14" />
    </Svg>
  )
}

export default function StretchCard({ stretch, checked, onToggle, onTimer }) {
  return (
    <View style={[s.card, checked && s.cardChecked]}>
      <Pressable
        onPress={onToggle}
        style={[s.checkbox, checked && s.checkboxChecked]}
      >
        {checked && <CheckIcon />}
      </Pressable>

      <View style={s.body}>
        <Text style={[s.name, checked && s.nameChecked]}>{stretch.name}</Text>
        <Text style={s.sub}>
          {stretch.duration}s{stretch.perSide ? ' per side' : ''}
          {stretch.alt ? `  ·  Alt: ${stretch.alt}` : ''}
        </Text>
      </View>

      <Pressable
        onPress={onTimer}
        style={({ pressed }) => [s.timerBtn, pressed && { opacity: 0.6 }]}
      >
        <TimerIcon />
      </Pressable>
    </View>
  )
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  cardChecked: {
    backgroundColor: C.orangeBg,
    borderWidth: 1,
    borderColor: C.orangeBorder,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.zinc600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    borderColor: C.orange,
    backgroundColor: C.orange,
  },
  body: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: C.white,
  },
  nameChecked: {
    color: C.orange,
  },
  sub: {
    fontSize: 12,
    color: C.zinc500,
    marginTop: 3,
  },
  timerBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.orangeBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
