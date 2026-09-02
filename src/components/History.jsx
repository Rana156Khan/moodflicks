import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function History({ session }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editNote, setEditNote] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  async function fetchItems() {
    setLoading(true)
    const { data, error: fetchError } = await supabase
      .from('recommendations')
      .select('*')
      .order('created_at', { ascending: false })
    setLoading(false)
    if (fetchError) setError(fetchError.message)
    else setItems(data)
  }

  function startEdit(item) {
    setEditingId(item.id)
    setEditNote(item.note || '')
  }

  async function saveEdit(id) {
    const { error: updateError } = await supabase
      .from('recommendations')
      .update({ note: editNote })
      .eq('id', id)
    if (updateError) {
      setError(updateError.message)
      return
    }
    setEditingId(null)
    fetchItems()
  }

  async function remove(id) {
    const { error: deleteError } = await supabase
      .from('recommendations')
      .delete()
      .eq('id', id)
    if (deleteError) setError(deleteError.message)
    else setItems(items.filter((i) => i.id !== id))
  }

  return (
    <div>
      <h1 className="history-title">My results</h1>
      <p className="history-sub">
        Every quiz you've saved, newest first. Edit a note or clear one out.
      </p>

      {error && <p className="error-note">{error}</p>}

      {loading ? (
        <p className="loading">Rewinding the tape…</p>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <p>Nothing saved yet. Take the quiz and save your first result.</p>
        </div>
      ) : (
        <div className="history-list">
          {items.map((item) => (
            <article className="history-item" key={item.id}>
              <div className="history-item-top">
                <span className="history-genre">{item.genre}</span>
                <span className="history-date">
                  {new Date(item.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <p className="history-mood">{item.mood}</p>

              {editingId === item.id ? (
                <div className="edit-row">
                  <textarea
                    rows="2"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Your note"
                  />
                  <div className="edit-row-buttons">
                    <button
                      className="btn-primary"
                      onClick={() => saveEdit(item.id)}
                    >
                      Save note
                    </button>
                    <button
                      className="btn-ghost"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {item.note && <p className="history-note">{item.note}</p>}
                  <div className="history-item-actions">
                    <button className="btn-ghost" onClick={() => startEdit(item)}>
                      {item.note ? 'Edit note' : 'Add note'}
                    </button>
                    <button className="btn-danger" onClick={() => remove(item.id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
