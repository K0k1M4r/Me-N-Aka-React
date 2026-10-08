import { useState } from 'react'

const PRONOUNS = ['she/her', 'he/him', 'they/them']

// First screen (name, pronouns, 18+). Also used to edit your profile later.
export default function AgeGate({ initial, onEnter }) {
  const [name, setName] = useState(initial?.name || '')
  const [pronouns, setPronouns] = useState(initial?.pronouns || 'they/them')
  const [isAdult, setIsAdult] = useState(Boolean(initial))
  const canEnter = name.trim() && isAdult

  return (
    <main className="gate">
      <span className="eyebrow-pill">✦ Story Chat</span>
      <h1 className="gate-title">{initial ? 'Your profile' : 'Your story starts here.'}</h1>
      <p className="gate-lead">Characters will use your name and pronouns in every story.</p>

      <form
        className="gate-form"
        onSubmit={(e) => {
          e.preventDefault()
          if (canEnter) onEnter({ name: name.trim(), pronouns })
        }}
      >
        <label className="field">
          <span>What should characters call you?</span>
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={30} placeholder="Your name" />
        </label>

        <fieldset className="field">
          <span>Pronouns</span>
          <div className="pronoun-row">
            {PRONOUNS.map((p) => (
              <button
                type="button"
                key={p}
                className={'pill pill-boxed' + (pronouns === p ? ' is-active' : '')}
                aria-pressed={pronouns === p}
                onClick={() => setPronouns(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </fieldset>

        {!initial && (
          <label className="check">
            <input type="checkbox" checked={isAdult} onChange={(e) => setIsAdult(e.target.checked)} />
            <span>I am 18 or older</span>
          </label>
        )}

        <button className="btn-primary" disabled={!canEnter}>{initial ? 'Save' : 'Start reading'}</button>
      </form>
    </main>
  )
}
