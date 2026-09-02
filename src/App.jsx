import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import Auth from './components/Auth.jsx'
import Quiz from './components/Quiz.jsx'
import History from './components/History.jsx'

export default function App() {
  const [session, setSession] = useState(null)
  const [checking, setChecking] = useState(true)
  const [view, setView] = useState('quiz') // 'quiz' | 'history'

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setChecking(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setView('quiz')
  }

  if (checking) return <p className="loading">Dimming the lights…</p>

  if (!session) return <Auth />

  return (
    <>
      <header className="site-header">
        <span className="wordmark">MoodFlicks</span>
        <nav className="nav-links">
          <button
            className={`nav-btn ${view === 'quiz' ? 'active' : ''}`}
            onClick={() => setView('quiz')}
          >
            Quiz
          </button>
          <button
            className={`nav-btn ${view === 'history' ? 'active' : ''}`}
            onClick={() => setView('history')}
          >
            My results
          </button>
          <button className="nav-btn signout" onClick={handleSignOut}>
            Sign out
          </button>
        </nav>
      </header>

      {view === 'quiz' ? (
        <Quiz session={session} onViewHistory={() => setView('history')} />
      ) : (
        <History session={session} />
      )}
    </>
  )
}
