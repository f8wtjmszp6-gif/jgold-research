import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const SecureStoreAdapter = {
  getItem: (key) => SecureStore.getItemAsync(key),
  setItem: (key, value) => SecureStore.setItemAsync(key, value),
  removeItem: (key) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(
  'https://byykqkcvohfswqcvkvja.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5eWtxa2N2b2hmc3dxY3ZrdmphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE2NDcyNDgsImV4cCI6MjA5NzIyMzI0OH0.zLCe5SS09mbMIqF9kZxwmmpoS1pcl-8bc2ShSjMCSFI',
  {
    auth: {
      storage: SecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
