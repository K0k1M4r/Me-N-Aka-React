import { useState } from 'react'
import Cover from './Cover.jsx'

const PALETTES = [
  ['#4A1526', '#E0466E'],
  ['#2A1B5C', '#9D7BF0'],
  ['#4A2A12', '#E89A4B'],
  ['#0E2A3F', '#2FA7C9'],
  ['#0F2E33', '#3FB5A8'],
  ['#3B0D1A', '#B3263E'],
]

const EMPTY = { name: '', role: '', storyTitle: '', personality: '', scenario: '', greeting: '', tags: '' }

export default function CreateCharacter({ onCreate, onCancel }) {
  const [form, setForm] = useState(EMPTY)
  const [palette, setPalette] = useState(0)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })
  const ready = form.name.trim() && form.personality.trim() && form.greeting.trim()

  // Live preview of the card while you type.
  const preview = {
    name: form.name || 'Your character',
    colors: PALETTES[palette],
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!ready) return
    onCreate({
      id: 'custom-' + Date.now(),
      name: form.name.trim(),
      role: form.role.trim() || 'A character of your own making',
      genre: 'Your Character',
      category: 'custom',
      moods: [],
      storyTitle: form.storyTitle.trim() || `A Story with ${form.name.trim()}`,
      description: form.personality.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean).slice(0, 3),
      personality: form.personality.trim(),
      scenario: form.scenario.trim() || 'The user meets this character for the first time.',
      greeting: form.greeting.trim(),
      colors: PALETTES[palette],
      custom: true,
    })
  }

  return (
    <main className="create">
      <div className="create-head">
        <span className="eyebrow">✦ Character studio</span>
        <h1>Create your dream character</h1>
        <p className="section-sub">Only the name, personality and first message are required. For a famous character, the name and a scenario are often enough.</p>
      </div>

      <div className="create-layout">
        <form className="create-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input value={form.name} onChange={update('name')} maxLength={40} placeholder="Selene Ward" />
          </label>
          <label className="field">
            <span>Who are they? <em>(optional)</em></span>
            <input value={form.role} onChange={update('role')} maxLength={70} placeholder="Academy rival & reluctant roommate" />
          </label>
          <label className="field">
            <span>Story title <em>(optional)</em></span>
            <input value={form.storyTitle} onChange={update('storyTitle')} maxLength={70} placeholder="Roommates with My Rival" />
          </label>
          <label className="field">
            <span>Personality</span>
            <textarea value={form.personality} onChange={update('personality')} rows={3} placeholder="Sharp-tongued, competitive, secretly kind. Hates losing." />
          </label>
          <label className="field">
            <span>Scenario <em>(optional)</em></span>
            <textarea value={form.scenario} onChange={update('scenario')} rows={3} placeholder="Where are you, and how did you meet?" />
          </label>
          <label className="field">
            <span>First message</span>
            <textarea value={form.greeting} onChange={update('greeting')} rows={3} placeholder="*She drops her bag on the other bed.* You've got to be kidding me." />
          </label>
          <label className="field">
            <span>Tags <em>(optional, comma separated)</em></span>
            <input value={form.tags} onChange={update('tags')} placeholder="Rivals, Slow Burn, Academy" />
          </label>

          <fieldset className="field">
            <span>Card colors</span>
            <div className="swatches">
              {PALETTES.map(([a, b], i) => (
                <button
                  type="button"
                  key={i}
                  className={'swatch' + (palette === i ? ' is-picked' : '')}
                  style={{ background: `linear-gradient(150deg, ${a}, ${b})` }}
                  onClick={() => setPalette(i)}
                  aria-label={`Color option ${i + 1}`}
                  aria-pressed={palette === i}
                />
              ))}
            </div>
          </fieldset>

          <div className="create-actions">
            <button type="button" className="btn-ghost" onClick={onCancel}>Cancel</button>
            <button className="btn-primary" disabled={!ready}>Create and start chatting</button>
          </div>
        </form>

        <aside className="create-preview" aria-label="Card preview">
          <Cover character={preview}>
            <div className="cover-caption">
              <span className="cover-name">{preview.name}</span>
              <span className="cover-role-small">{form.role || 'A character of your own making'}</span>
            </div>
          </Cover>
        </aside>
      </div>
    </main>
  )
}
