import { useState } from 'react'
import StoryCard from './StoryCard.jsx'
import { MOODS, CATEGORIES } from '../data/filters.js'

const FEATURES = [
  { icon: '❖', label: 'Immersive chat & endless stories' },
  { icon: '◉', label: 'Soul & deep memory' },
  { icon: '♡', label: 'Friendly or flirty modes' },
  { icon: '✎', label: 'Create your dream character' },
]

export default function Home({ characters, onOpen, onCreate }) {
  const [query, setQuery] = useState('')
  const [mood, setMood] = useState('all')
  const [category, setCategory] = useState('all')

  const spotlight = characters.filter((c) => c.featured)

  // Only show category buttons that have at least one character.
  const categories = CATEGORIES.filter(
    (cat) => cat.id === 'all' || characters.some((c) => c.category === cat.id)
  )

  const q = query.trim().toLowerCase()
  const visible = characters.filter((c) => {
    if (mood !== 'all' && !c.moods?.includes(mood)) return false
    if (category !== 'all' && c.category !== category) return false
    if (!q) return true
    const haystack = [c.name, c.role, c.genre, c.storyTitle, ...(c.tags || [])].join(' ').toLowerCase()
    return haystack.includes(q)
  })

  return (
    <main className="home">
      <section className="hero">
        <span className="eyebrow-pill">✦ Endless interactive stories</span>
        <h1 className="hero-title">Step into a story that answers back.</h1>
        <p className="hero-lead">
          <strong>You're the main character.</strong> Slow-burn romance, a fantasy adventure, or a
          friend who always picks up at 2 a.m. No scripts: every message you send pushes the story somewhere new.
        </p>
        <ul className="feature-chips">
          {FEATURES.map((f) => (
            <li key={f.label}><span aria-hidden="true">{f.icon}</span>{f.label}</li>
          ))}
        </ul>
      </section>

      {spotlight.length > 0 && (
        <section className="section">
          <div className="section-head">
            <div>
              <span className="eyebrow">✦ Spotlight releases</span>
              <h2>What's your story tonight?</h2>
              <p className="section-sub">Pick one of today's headline stories and step straight into the driver's seat.</p>
            </div>
          </div>
          <div className="spotlight-grid">
            {spotlight.map((c) => (
              <StoryCard key={c.id} character={c} variant="spotlight" onOpen={onOpen} />
            ))}
          </div>
        </section>
      )}

      <section className="section">
        <div className="section-head section-head-split">
          <div>
            <h2>Story tropes & roleplay moods</h2>
            <p className="section-sub">Filter by archetype or vibe, or search for your dream companion.</p>
          </div>
          <label className="search">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by trope, name, mood…"
              aria-label="Search stories"
            />
          </label>
        </div>

        <div className="filter-row">
          <span className="filter-label">Story mood:</span>
          {MOODS.map((m) => (
            <button
              key={m.id}
              className={'pill' + (mood === m.id ? ' is-active' : '')}
              aria-pressed={mood === m.id}
              onClick={() => setMood(m.id)}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="filter-row filter-scroll">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={'pill pill-boxed' + (category === cat.id ? ' is-active' : '')}
              aria-pressed={category === cat.id}
              onClick={() => setCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="story-grid">
          <article className="create-card">
            <span className="create-plus" aria-hidden="true">+</span>
            <h3>Create your dream AI character</h3>
            <p>Got a specific fictional crush in mind? Type a name, describe their personality, and start a story right away.</p>
            <button className="btn-outline" onClick={onCreate}>Launch Character Studio <span aria-hidden="true">→</span></button>
          </article>

          {visible.map((c) => (
            <StoryCard key={c.id} character={c} onOpen={onOpen} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="empty">No stories match that. Try another mood or search.</p>
        )}
      </section>

      <footer className="site-footer">Story Chat · Step into the story where you call the shots</footer>
    </main>
  )
}
