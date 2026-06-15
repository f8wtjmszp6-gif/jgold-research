import { useState, useEffect } from 'react'

const STORAGE_KEY = 'workout-tracker'

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function useStore() {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    saveState(state)
  }, [state])

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

  return { currentWeek, setWeek, getChecked, toggleChecked, clearDay, getTodayKey }
}
