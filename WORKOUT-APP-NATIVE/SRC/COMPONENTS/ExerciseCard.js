import { View, Text, Pressable, StyleSheet } from 'react-native'
import Svg, { Polyline } from 'react-native-svg'
import { C } from '../colors'

export default function ExerciseCard({ exercise, checked, onToggle }) {
  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [s.card, checked && s.cardChecked, pressed && s.pressed]}
    >
      <View style={[s.checkbox, checked && s.checkboxChecked]}>
        {checked && (
          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <Polyline points="20 6 9 17 4 12" />
          </Svg>
        )}
      </View>
      <View style={s.body}>
        <Text style={[s.name, checked && s.nameChecked]}>
          {exercise.name}
          {exercise.perSide && <Text style={s.perSide}> (per side)</Text>}
        </Text>
        <Text style={s.sets}>{exercise.sets} sets × {exercise.reps}</Text>
        <Text style={s.weight}>{exercise.weight}</Text>
      </View>
    </Pressable>
  )
}

const s = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  pressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.zinc600,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
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
    textDecorationLine: 'line-through',
  },
  perSide: {
    color: C.zinc500,
    fontWeight: '400',
    fontSize: 13,
  },
  sets: {
    fontSize: 13,
    color: C.zinc400,
    marginTop: 3,
  },
  weight: {
    fontSize: 12,
    color: C.zinc500,
    marginTop: 2,
  },
})
