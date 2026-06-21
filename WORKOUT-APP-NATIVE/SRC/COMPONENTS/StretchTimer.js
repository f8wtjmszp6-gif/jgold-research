import { useState, useEffect, useRef } from 'react'
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import * as Haptics from 'expo-haptics'
import { C } from '../colors'

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function StretchTimer({ stretch, onClose }) {
  const [side, setSide] = useState(1)
  const [timeLeft, setTimeLeft] = useState(stretch.duration)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const intervalRef = useRef(null)

  const progress = 1 - timeLeft / stretch.duration
  const strokeOffset = CIRCUMFERENCE * (done ? 0 : 1 - progress)

  useEffect(() => {
    if (running && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current)
            setRunning(false)
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
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

  return (
    <Modal transparent animationType="fade" statusBarTranslucent>
      <View style={s.overlay}>
        <View style={s.sheet}>
          <Text style={s.title}>{stretch.name}</Text>
          {stretch.alt && <Text style={s.alt}>Alt: {stretch.alt}</Text>}
          {stretch.perSide && (
            <Text style={s.side}>{done ? 'Complete!' : `Side ${side} of 2`}</Text>
          )}

          <View style={s.timerWrap}>
            <Svg
              width={144}
              height={144}
              viewBox="0 0 120 120"
              style={{ transform: [{ rotate: '-90deg' }] }}
            >
              <Circle cx={60} cy={60} r={RADIUS} fill="none" stroke={C.zinc700} strokeWidth={8} />
              <Circle
                cx={60}
                cy={60}
                r={RADIUS}
                fill="none"
                stroke={done ? C.green : C.orange}
                strokeWidth={8}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={strokeOffset}
              />
            </Svg>
            <View style={s.timerCenter}>
              {done ? (
                <Text style={s.checkmark}>✓</Text>
              ) : (
                <Text style={s.countdown}>{timeLeft}</Text>
              )}
            </View>
          </View>

          <View style={s.btnRow}>
            {!done && (
              <Pressable
                onPress={() => setRunning(r => !r)}
                style={({ pressed }) => [s.primaryBtn, pressed && { opacity: 0.85 }]}
              >
                <Text style={s.primaryBtnText}>{running ? 'Pause' : 'Start'}</Text>
              </Pressable>
            )}
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                done ? s.doneBtn : s.secondaryBtn,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={done ? s.primaryBtnText : s.secondaryBtnText}>
                {done ? 'Done' : 'Close'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  )
}

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  sheet: {
    backgroundColor: C.zinc900,
    borderRadius: 24,
    padding: 32,
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: C.white,
    textAlign: 'center',
  },
  alt: {
    fontSize: 13,
    color: C.zinc500,
    textAlign: 'center',
    marginTop: 4,
  },
  side: {
    fontSize: 14,
    color: C.orange,
    marginTop: 6,
    textAlign: 'center',
  },
  timerWrap: {
    width: 144,
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  timerCenter: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countdown: {
    fontSize: 40,
    fontWeight: '700',
    color: C.white,
  },
  checkmark: {
    fontSize: 40,
    color: C.green,
  },
  btnRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: C.orange,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  doneBtn: {
    flex: 1,
    backgroundColor: '#16a34a',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryBtn: {
    backgroundColor: C.zinc700,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: C.zinc300,
    fontWeight: '600',
    fontSize: 16,
  },
})
