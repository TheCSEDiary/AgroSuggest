import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase' // We added this to talk to Google

export default function Login() {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccessMsg('')
    setLoading(true)

    try {
      if (isSignUp) {
        await signUp(email, password)
        setSuccessMsg('Account created! Please check your email to confirm, then log in.')
        setIsSignUp(false) 
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- NEW FUNCTION FOR GOOGLE LOGIN ---
  async function handleGoogleSignIn() {
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin // This tells Google where to send the user back
      }
    })
    if (error) {
      setError(error.message)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '24px', background: 'white', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
      <h2 style={{ color: '#2d5016', textAlign: 'center', marginBottom: '10px' }}>
        {isSignUp ? 'Create Account' : 'Welcome to AgroSuggest'}
      </h2>
      <p style={{ textAlign: 'center', color: '#666', marginBottom: '24px', fontSize: '15px' }}>
        {isSignUp ? 'Sign up to save your crop lookups.' : 'Log in to get crop recommendations.'}
      </p>

      {/* --- GOOGLE BUTTON --- */}
      {!isSignUp && (
        <button
          onClick={handleGoogleSignIn}
          style={{ width: '100%', padding: '12px', background: 'white', color: '#333', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginBottom: '20px' }}
        >
          <span style={{ fontSize: '20px' }}>🔵</span> Sign in with Google
        </button>
      )}

      {/* --- DIVIDER --- */}
      {!isSignUp && (
        <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0' }}>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
          <span style={{ padding: '0 10px', color: '#888', fontSize: '14px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
        </div>
      )}

      {/* --- EMAIL FORM --- */}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px' }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            style={{ width: '100%', padding: '12px', border: '1px solid #ccc', borderRadius: '8px', fontSize: '16px' }}
          />
        </div>

        {error && <p style={{ color: '#c0392b', marginBottom: '16px', fontSize: '14px' }}>{error}</p>}
        {successMsg && <p style={{ color: '#27ae60', marginBottom: '16px', fontSize: '14px' }}>{successMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          style={{ width: '100%', padding: '14px', background: '#2d5016', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}
        >
          {loading ? 'Please wait...' : (isSignUp ? 'Sign Up' : 'Log In')}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#555' }}>
        {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          onClick={() => { setIsSignUp(!isSignUp); setError(''); setSuccessMsg(''); }}
          style={{ background: 'none', border: 'none', color: '#2d5016', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' }}
        >
          {isSignUp ? 'Log In' : 'Sign Up'}
        </button>
      </p>
    </div>
  )
}