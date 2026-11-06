import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// 1. Create the Auth Context
const AuthContext = createContext()

// 2. Create the Provider component
// This will wrap our whole app and give every component access to login features
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // Listen for login/logout changes from Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    // Cleanup subscription when component unmounts
    return () => subscription.unsubscribe()
  }, [])

  // Function to sign up a new farmer
  const signUp = async (email, password) => {
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) throw error
  }

  // Function to log in an existing farmer
  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  // Function to log out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. Custom hook to easily use auth in any component
export function useAuth() {
  return useContext(AuthContext)
}