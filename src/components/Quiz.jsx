import { useState } from 'react'
import { supabase } from '../supabaseClient'
import { QUESTIONS, GENRE_INFO, scoreAnswers } from '../quizData'

// Quiz state lives only in React memory on purpose:
// leaving or refreshing the page resets the quiz, so it must be
// finished in one sitting (a core rule of the app).

export default function Quiz({ session, onViewHistory }) {
  const [stage, setStage] = useState('intro') // 'intro' | 'question' | 'result'
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  function start() {
    setStage('question')
    setCurrent(0)
    setAnswers([])
    setNote('')
    setSaved(false)
    setError('')
  }

  function pick(optionIndex) {
    const next = [...answers, optionIndex]
    if (next.length === QUESTIONS.length) {
      setAnswers(next)
      setStage('result')
    } else {
      setAnswers(next)
      setCurrent(current + 1)
    }
  }

  async function saveResult(genre) {
    setSaving(true)
    setError('')
    const { error: insertError } = await supabase.from('recommendations').insert({
      user_id: session.user.id,
      genre,
      mood: GENRE_INFO[genre].mood,
      note,
    })
    setSaving(false)
    if (insertError) {
      setError(insertError.message)
    } else {
      setSaved(true)
    }
  }

  if (stage === 'intro') {
    return (
      <div className="intro">
        <h1>Six questions between you and tonight's movie.</h1>
        <p>
          Answer honestly and in one sitting — if you leave the page, the quiz
          starts over. At the end you'll get a genre matched to your mood, and
          you can save it to your results.
        </p>
        <button className="btn-primary" onClick={start}>
          Start the quiz
        </button>
      </div>
    )
  }

  if (stage === 'question') {
    const q = QUESTIONS[current]
    return (
      <div>
        <p className="quiz-progress">
          Question {current + 1} of {QUESTIONS.length}
        </p>
        <h2 className="quiz-question">{q.q}</h2>
        <div className="quiz-options">
          {q.options.map((opt, i) => (
            <button key={i} className="quiz-option" onClick={() => pick(i)}>
              {opt.text}
            </button>
          ))}
        </div>
        <p className="quiz-warning">
          Finish in one go — leaving the page resets your answers.
        </p>
      </div>
    )
  }

  // stage === 'result'
  const genre = scoreAnswers(answers)
  const info = GENRE_INFO[genre]

  return (
    <div className="panel">
      <p className="result-mood">{info.mood}</p>
      <h2 className="result-genre">{genre}</h2>
      <p className="result-blurb">{info.blurb}</p>
      <p className="save-note">Three places to start:</p>
      <ul className="result-picks">
        {info.picks.map((film) => (
          <li key={film}>{film}</li>
        ))}
      </ul>

      {saved ? (
        <>
          <p className="saved-confirm">Saved to your results.</p>
          <div className="result-actions">
            <button className="btn-primary" onClick={onViewHistory}>
              View my results
            </button>
            <button className="btn-ghost" onClick={start}>
              Retake the quiz
            </button>
          </div>
        </>
      ) : (
        <>
          <textarea
            rows="2"
            placeholder="Add a note (optional) — e.g. what you ended up watching"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          {error && <p className="error-note">{error}</p>}
          <div className="result-actions">
            <button
              className="btn-primary"
              onClick={() => saveResult(genre)}
              disabled={saving}
            >
              {saving ? 'Saving…' : 'Save this result'}
            </button>
            <button className="btn-ghost" onClick={start}>
              Retake the quiz
            </button>
          </div>
        </>
      )}
    </div>
  )
}
