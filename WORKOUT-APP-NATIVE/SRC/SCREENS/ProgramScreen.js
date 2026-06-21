import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { twelveWeekProgram, progressionRules, coreProgression } from '../data/workout'
import { C } from '../colors'

export default function ProgramScreen({ currentWeek, onSetWeek }) {
  const insets = useSafeAreaInsets()

  return (
    <View style={[s.container, { paddingTop: insets.top }]}>
      <View style={s.header}>
        <Text style={s.title}>12-Week Program</Text>
        <Text style={s.subtitle}>Tap a week to set as current</Text>
      </View>

      <ScrollView style={s.list} contentContainerStyle={s.listContent} showsVerticalScrollIndicator={false}>
        {/* Week grid */}
        <Section title="Weekly Instructions">
          {twelveWeekProgram.map(({ week, instruction, detail }) => {
            const isCurrent = week === currentWeek
            const isPast = week < currentWeek
            return (
              <Pressable
                key={week}
                onPress={() => onSetWeek(week)}
                style={({ pressed }) => [
                  s.weekCard,
                  isCurrent && s.weekCardCurrent,
                  isPast && s.weekCardPast,
                  pressed && { opacity: 0.75, transform: [{ scale: 0.98 }] },
                ]}
              >
                <View style={[s.weekNum, isCurrent && s.weekNumCurrent, isPast && s.weekNumPast]}>
                  <Text style={[s.weekNumText, isCurrent && s.weekNumTextActive]}>{week}</Text>
                </View>
                <View style={s.weekBody}>
                  <Text style={[s.weekInstruction, isCurrent && s.weekInstructionActive]}>{instruction}</Text>
                  <Text style={s.weekDetail}>{detail}</Text>
                </View>
                {isCurrent && (
                  <View style={s.currentBadge}>
                    <Text style={s.currentBadgeText}>Current</Text>
                  </View>
                )}
              </Pressable>
            )
          })}
        </Section>

        {/* Progression Rules */}
        <Section title="Weight Progression Rules">
          <Text style={s.sectionNote}>Applied at weeks 5 & 9</Text>
          {progressionRules.map(r => (
            <View key={r.category} style={s.ruleCard}>
              <Text style={s.ruleCategory}>{r.category}</Text>
              <Text style={s.ruleExercises}>{r.exercises}</Text>
              <Text style={s.ruleValue}>{r.rule}</Text>
            </View>
          ))}
          <View style={s.ruleCard}>
            <Text style={s.hint}>💡 Barbell upper body adds 2.5 lbs per side — fractional plates recommended</Text>
          </View>
        </Section>

        {/* Core Progression */}
        <Section title="Core Progression">
          {coreProgression.map(c => (
            <View key={c.exercise} style={s.ruleCard}>
              <Text style={s.ruleCategory}>{c.exercise}</Text>
              <Text style={s.coreRule}>{c.rule}</Text>
            </View>
          ))}
        </Section>

        {/* After Week 12 */}
        <Section title="After Week 12">
          <View style={s.ruleCard}>
            <Text style={s.ruleCategory}>Restart the Cycle</Text>
            <Text style={s.coreRule}>
              Begin cycle 2 at the weight used in{' '}
              <Text style={{ color: C.orange, fontWeight: '600' }}>week 9 of the previous cycle</Text>.
              {' '}That is your new starting baseline.
            </Text>
          </View>
        </Section>
      </ScrollView>
    </View>
  )
}

function Section({ title, children }) {
  return (
    <View style={sec.wrap}>
      <Text style={sec.title}>{title}</Text>
      <View style={sec.content}>{children}</View>
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
    paddingTop: 8,
    paddingBottom: 16,
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
  list: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    gap: 24,
  },
  weekCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 14,
    gap: 12,
    marginBottom: 8,
  },
  weekCardCurrent: {
    backgroundColor: C.orangeBg,
    borderWidth: 1,
    borderColor: C.orangeBorder,
  },
  weekCardPast: {
    opacity: 0.5,
  },
  weekNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.zinc800,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekNumCurrent: {
    backgroundColor: C.orange,
  },
  weekNumPast: {
    backgroundColor: C.zinc700,
  },
  weekNumText: {
    fontSize: 13,
    fontWeight: '700',
    color: C.zinc400,
  },
  weekNumTextActive: {
    color: 'white',
  },
  weekBody: {
    flex: 1,
  },
  weekInstruction: {
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
  },
  weekInstructionActive: {
    color: C.orange,
  },
  weekDetail: {
    fontSize: 12,
    color: C.zinc500,
    marginTop: 3,
  },
  currentBadge: {
    backgroundColor: C.orange,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'center',
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  sectionNote: {
    fontSize: 12,
    color: C.zinc500,
    marginBottom: 10,
  },
  ruleCard: {
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  ruleCategory: {
    fontSize: 14,
    fontWeight: '600',
    color: C.white,
  },
  ruleExercises: {
    fontSize: 11,
    color: C.zinc500,
    marginTop: 3,
  },
  ruleValue: {
    fontSize: 13,
    color: C.orange,
    fontWeight: '500',
    marginTop: 6,
  },
  coreRule: {
    fontSize: 13,
    color: C.zinc400,
    marginTop: 4,
    lineHeight: 18,
  },
  hint: {
    fontSize: 12,
    color: C.zinc400,
  },
})

const sec = StyleSheet.create({
  wrap: {},
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: C.white,
    marginBottom: 12,
  },
  content: {},
})
