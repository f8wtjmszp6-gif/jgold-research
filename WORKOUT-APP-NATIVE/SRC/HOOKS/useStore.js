import { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { supabase } from '../lib/supabase'

const LOCAL_KEY = 'workout-tracker'

export function useStore(session) {
  const [state, setState] = useState({})
  const [loaded, setLoaded] = useState(false)
  const syncTimer = useRef(null)
  const isFirstLoad = useRef(true)

  // Load data: cloud first if signed in, otherwise local
  useEffect(() => {
    async function load() {
      if (session) {
        const { data, error } = await supabase
          .from('workout_data')
          .select('data')
          .eq('user_id', session.user.id)
          .single()

        if (data?.data) {
          setState(data.data)
          await AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(data.data))
        } else {
          // New user — check if there's local data to migrate
          const raw = await AsyncStorage.getItem(LOCAL_KEY)
          if (raw) setState(JSON.parse(raw))
        }
      } else {
        const raw = await AsyncStorage.getItem(LOCAL_KEY)
        if (raw) {
          try { setState(JSON.parse(raw)) } catch {}
        }
      }
      setLoaded(true)
      isFirstLoad.current = false
    }
    load()
  }, [session?.user?.id])

  // Save locally immediately, sync to cloud after 1.5s debounce
  useEffect(() => {
    if (!loaded || isFirstLoad.current) return
    AsyncStorage.setItem(LOCAL_KEY, JSON.stringify(state))

    if (session) {
      clearTimeout(syncTimer.current)
      syncTimer.current = setTimeout(() => {
        supabase.from('workout_data').upsert({
          user_id: session.user.id,
          data: state,
          updated_at: new Date().toISOString(),
        })
      }, 1500)
    }
  }, [state, loaded, session])

  const currentWeek = state.currentWeek ?? 1

  function setWeek(week) {
    setState(s => ({ ...s, currentWeek: week }))
  }

  function getTodayKey() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return days[new Date().getDay()]
  }

  function getChecked(day, section, id) {
    return state[day]?.[section]?.[id] ?? false
  }

  function toggleChecked(day, section, id) {
    setState(s => ({
      ...s,
      [day]: {
        ...s[day],
        [section]: {
          ...s[day]?.[section],
          [id]: !s[day]?.[section]?.[id],
        },
      },
    }))
  }

  function clearDay(day) {
    setState(s => ({ ...s, [day]: {} }))
  }

  return { loaded, currentWeek, setWeek, getChecked, toggleChecked, clearDay, getTodayKey }
}
