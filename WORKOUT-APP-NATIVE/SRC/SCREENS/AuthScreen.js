import { useState } from 'react'
import {
  View, Text, TextInput, Pressable, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { supabase } from '../lib/supabase'
import { C } from '../colors'

export default function AuthScreen() {
  const insets = useSafeAreaInsets()
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter your email and password.')
      return
    }
    setLoading(true)
    let error
    if (mode === 'signin') {
      const res = await supabase.auth.signInWithPassword({ email, password })
      error = res.error
    } else {
      const res = await supabase.auth.signUp({ email, password })
      error = res.error
      if (!error) {
        Alert.alert('Account created', 'Check your email for a confirmation link, then sign in.')
        setMode('signin')
        setLoading(false)
        return
      }
    }
    if (error) Alert.alert('Error', error.message)
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      style={[s.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={s.inner}>
        <View style={s.headerWrap}>
          <Text style={s.logo}>🏋️</Text>
          <Text style={s.title}>Workout Tracker</Text>
          <Text style={s.subtitle}>
            {mode === 'signin' ? 'Sign in to sync your data' : 'Create an account'}
          </Text>
        </View>

        <View style={s.form}>
          <TextInput
            style={s.input}
            placeholder="Email"
            placeholderTextColor={C.zinc500}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
          />
          <TextInput
            style={s.input}
            placeholder="Password"
            placeholderTextColor={C.zinc500}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          />

          <Pressable
            style={({ pressed }) => [s.btn, pressed && { opacity: 0.85 }]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="white" />
              : <Text style={s.btnText}>{mode === 'signin' ? 'Sign In' : 'Create Account'}</Text>
            }
          </Pressable>
        </View>

        <Pressable onPress={() => setMode(m => m === 'signin' ? 'signup' : 'signin')}>
          <Text style={s.toggle}>
            {mode === 'signin'
              ? "Don't have an account? Sign up"
              : 'Already have an account? Sign in'}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    gap: 32,
  },
  headerWrap: {
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    fontSize: 48,
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: C.white,
  },
  subtitle: {
    fontSize: 14,
    color: C.zinc400,
  },
  form: {
    gap: 12,
  },
  input: {
    backgroundColor: C.card,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: C.white,
    borderWidth: 1,
    borderColor: C.border,
  },
  btn: {
    backgroundColor: C.orange,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  toggle: {
    color: C.orange,
    fontSize: 14,
    textAlign: 'center',
  },
})
