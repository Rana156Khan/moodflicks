import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Auth() {
  const [mode, setMode] = useState('signin') // 'signin' | 'signup'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit() {
    setError('')
    if (!email || !password) {
      setError('Enter an email and a password to continue.')
      return
    }
    setBusy(true)
    const action =
      mode === 'signup'
        ? supabase.auth.signUp({ email, password })
        : supabase.auth.signInWithPassword({ email, password })
    const { error: authError } = await action
    setBusy(false)
    if (authError) setError(authError.message)
  }

  return (
    <div className="auth-panel">
      <h1>What should you watch tonight?</h1>
      <p className="tagline">
        A one-minute quiz that reads your mood and hands you a genre.
      </p>

      <div className="auth-form">
        {error && <p className="error-note">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password (min 6 characters)"
          value={password}
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button className="btn-primary" onClick={handleSubmit} disabled={busy}>
          {busy
            ? 'One moment…'
            : mode === 'signup'
              ? 'Create account'
              : 'Sign in'}
        </button>
      </div>

      <p className="auth-toggle">
        {mode === 'signup' ? 'Already have an account?' : 'New here?'}
        <button
          onClick={() => {
            setMode(mode === 'signup' ? 'signin' : 'signup')
            setError('')
          }}
        >
          {mode === 'signup' ? 'Sign in' : 'Create an account'}
        </button>
      </p>
    </div>
  )
}
