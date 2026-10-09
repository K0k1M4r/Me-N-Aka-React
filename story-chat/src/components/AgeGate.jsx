import { useState } from 'react'
import { GENDERS } from '../data/profile.js'

// First screen (name, gender, 18+). Also used to edit your profile later.
export default function AgeGate({ initial, onEnter }) {
  const [name, setName] = useState(initial?.name || '')
  const [pronouns, setPronouns] = useState(initial?.pronouns || 'they/them')
  const [isAdult, setIsAdult] = useState(Boolean(initial))
  const canEnter = name.trim() && isAdult

  return (
    <main className="gate">
      <span className="eyebrow-pill">✦ Story Chat</span>
      <h1 className="gate-title">{initial ? 'შენი პროფილი' : 'შენი ისტორია აქ იწყება.'}</h1>
      <p className="gate-lead">პერსონაჟები ყველა ისტორიაში შენს სახელს გამოიყენებენ და ისე მოგმართავენ, როგორც აქ აირჩევ.</p>

      <form
        className="gate-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (canEnter) onEnter({ name: name.trim(), pronouns })
        }}
      >
        <label className="field">
          <span>რა გქვია?</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} placeholder="შენი სახელი" />
        </label>

        <fieldset className="field">
          <span>როგორ მოგმართონ პერსონაჟებმა?</span>
          <div className="pronoun-row">
            {GENDERS.map((g) => (
              <button
                type="button"
                key={g.value}
                className={'pill pill-boxed' + (pronouns === g.value ? ' is-active' : '')}
                aria-pressed={pronouns === g.value}
                onClick={() => setPronouns(g.value)}
              >
                {g.label}
              </button>
            ))}
          </div>
        </fieldset>

        {!initial && (
          <label className="check">
            <input type="checkbox" checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} />
            <span>ვადასტურებ, რომ 18 წლის ან უფროსი ვარ</span>
          </label>
        )}

        <button className="btn-primary" disabled={!canEnter}>{initial ? 'შენახვა' : 'დაწყება'}</button>
      </form>
    </main>
  )
}
