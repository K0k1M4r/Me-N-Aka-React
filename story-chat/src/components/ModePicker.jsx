import { useState } from 'react'
import Avatar from './Avatar.jsx'
import { RELATIONSHIPS, TONES, ATTITUDES } from '../data/modes.js'

// Walks through up to three choices, then hands back a mode object:
// { relationship: 'friendly' | 'flirty', tone: ..., attitude: ... | null }
export default function ModePicker({ character, onPick, onBack }) {
  const [relationship, setRelationship] = useState(null)
  const [tone, setTone] = useState(null)

  let question, options, choose, goBack

  if (!relationship) {
    question = `How do you want to meet ${character.name}?`
    options = RELATIONSHIPS
    choose = (id) => setRelationship(id)
    goBack = onBack
  } else if (!tone) {
    question = relationship === 'friendly' ? 'How should they talk?' : 'How far should it go?'
    options = TONES[relationship]
    choose = (id) => {
      // Friendly stories are ready now. Flirty ones get one more question.
      if (relationship === 'friendly') onPick({ relationship, tone: id, attitude: null })
      else setTone(id)
    }
    goBack = () => setRelationship(null)
  } else {
    question = `How does ${character.name} feel about you?`
    options = ATTITUDES
    choose = (id) => onPick({ relationship, tone, attitude: id })
    goBack = () => setTone(null)
  }

  return (
    <div className="picker" style={{ '--c1': character.colors[0], '--c2': character.colors[1] }}>
      <header className="topbar">
        <button className="btn-ghost" onClick={goBack}>Back</button>
      </header>

      <div className="picker-body">
        <Avatar character={character} size={72} />
        <p className="picker-tagline">{character.storyTitle || character.role}</p>
        <h1 className="picker-question">{question}</h1>

        <ul className="choices">
          {options.map((o) => (
            <li key={o.id}>
              <button className="choice" onClick={() => choose(o.id)}>
                <span className="choice-label">{o.label}</span>
                <span className="choice-desc">{o.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
