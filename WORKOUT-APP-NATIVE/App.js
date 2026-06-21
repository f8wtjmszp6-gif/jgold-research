import { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { supabase } from './src/lib/supabase'
import { useStore } from './src/hooks/useStore'
import { schedule } from './src/data/workout'
import NavBar from './src/components/NavBar'
import HomeScreen from './src/screens/HomeScreen'
import DayScreen from './src/screens/DayScreen'
import ProgramScreen from './src/screens/ProgramScreen'
import AuthScreen from './src/screens/AuthScreen'
import { C } from './src/colors'

function Root({ session }) {
  const [screen, setScreen] = useState('home')
  const [selectedDay, setSelectedDay] = useState(null)
  const store = useStore(session)

  if (!store.loaded) {
    return (
      <View style={s.loading}>
        <ActivityIndicator color={C.orange} size="large" />
      </View>
    )
  }

  function openDay(day) {
    setSelectedDay(day)
    setScreen('day')
  }

  return (
    <View style={s.root}>
      <View style={s.content}>
        {screen === 'home' && (
          <HomeScreen
            onSelectDay={openDay}
            currentWeek={store.currentWeek}
            store={store}
            onSignOut={() => supabase.auth.signOut()}
          />
        )}
        {screen === 'day' && selectedDay && (
          <DayScreen
            day={selectedDay}
            dayData={schedule[selectedDay]}
            store={store}
            onBack={() => setScreen('home')}
          />
        )}
        {screen === 'program' && (
          <ProgramScreen currentWeek={store.currentWeek} onSetWeek={store.setWeek} />
        )}
      </View>
      <NavBar screen={screen} setScreen={setScreen} />
    </View>
  )
}

export default function App() {
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {authLoading
        ? <View style={s.loading}><ActivityIndicator color={C.orange} size="large" /></View>
        : session
          ? <Root session={session} />
          : <AuthScreen />
      }
    </SafeAreaProvider>
  )
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
