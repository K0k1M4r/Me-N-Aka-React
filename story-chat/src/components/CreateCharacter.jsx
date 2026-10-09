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
    name: form.name || 'შენი პერსონაჟი',
    colors: PALETTES[palette],
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!ready) return
    onCreate({
      id: 'custom-' + Date.now(),
      name: form.name.trim(),
      role: form.role.trim() || 'შენი შექმნილი პერსონაჟი',
      genre: 'შენი პერსონაჟი',
      category: 'custom',
      moods: [],
      storyTitle: form.storyTitle.trim() || `ისტორია: ${form.name.trim()}`,
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
        <span className="eyebrow">✦ პერსონაჟების სტუდია</span>
        <h1>შექმენი შენი იდეალური პერსონაჟი</h1>
        <p className="section-sub">სავალდებულოა მხოლოდ სახელი, ხასიათი და პირველი შეტყობინება. ცნობილი პერსონაჟისთვის ხშირად სახელი და სცენარიც საკმარისია.</p>
      </div>

      <div className="create-layout">
        <form className="create-form" onSubmit={handleSubmit}>
          <label className="field">
            <span>სახელი</span>
            <input value={form.name} onChange={update('name')} maxLength={40} placeholder="სელინ უორდი" />
          </label>
          <label className="field">
            <span>ვინ არის? <em>(არასავალდებულო)</em></span>
            <input value={form.role} onChange={update('role')} maxLength={70} placeholder="აკადემიის მეტოქე და უნებლიე ოთახის მეზობელი" />
          </label>
          <label className="field">
            <span>ისტორიის სათაური <em>(არასავალდებულო)</em></span>
            <input value={form.storyTitle} onChange={update('storyTitle')} maxLength={70} placeholder="ოთახის მეზობელი, ჩემი მეტოქე" />
          </label>
          <label className="field">
            <span>ხასიათი</span>
            <textarea value={form.personality} onChange={update('personality')} rows={3} placeholder="ენაბასრი, შეჯიბრის მოყვარული, გულში კეთილი. წაგება ეჯავრება." />
          </label>
          <label className="field">
            <span>სცენარი <em>(არასავალდებულო)</em></span>
            <textarea value={form.scenario} onChange={update('scenario')} rows={3} placeholder="სად ხართ და როგორ გაიცანით ერთმანეთი?" />
          </label>
          <label className="field">
            <span>პირველი შეტყობინება</span>
            <textarea value={form.greeting} onChange={update('greeting')} rows={3} placeholder="*ჩანთას მეორე საწოლზე ისვრის.* ხუმრობ, არა?" />
          </label>
          <label className="field">
            <span>თეგები <em>(არასავალდებულო, მძიმით გამოყოფილი)</em></span>
            <input value={form.tags} onChange={update('tags')} placeholder="მეტოქეები, ნელი რომანტიკა, აკადემია" />
          </label>

          <fieldset className="field">
            <span>ბარათის ფერები</span>
            <div className="swatches">
              {PALETTES.map(([a, b], i) => (
                <button
                  type="button"
                  key={i}
                  className={'swatch' + (palette === i ? ' is-picked' : '')}
                  style={{ background: `linear-gradient(150deg, ${a}, ${b})` }}
                  onClick={() => setPalette(i)}
                  aria-label={`ფერი ${i + 1}`}
                  aria-pressed={palette === i}
                />
              ))}
            </div>
          </fieldset>

          <div className="create-actions">
            <button type="button" className="btn-ghost" onClick={onCancel}>გაუქმება</button>
            <button className="btn-primary" disabled={!ready}>შექმნა და ჩატის დაწყება</button>
          </div>
        </form>

        <aside className="create-preview" aria-label="ბარათის გადახედვა">
          <Cover character={preview}>
            <div className="cover-caption">
              <span className="cover-name">{preview.name}</span>
              <span className="cover-role-small">{form.role || 'შენი შექმნილი პერსონაჟი'}</span>
            </div>
          </Cover>
        </aside>
      </div>
    </main>
  )
}
