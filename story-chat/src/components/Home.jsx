import { useState } from 'react'
import StoryCard from './StoryCard.jsx'
import { MOODS, CATEGORIES } from '../data/filters.js'

const FEATURES = [
  { icon: '❖', label: 'ცოცხალი ჩატი და უსასრულო ისტორიები' },
  { icon: '◉', label: 'ხასიათი და ღრმა მეხსიერება' },
  { icon: '♡', label: 'მეგობრული ან რომანტიკული რეჟიმი' },
  { icon: '✎', label: 'შექმენი შენი პერსონაჟი' },
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
        <span className="eyebrow-pill">✦ უსასრულო ინტერაქტიული ისტორიები</span>
        <h1 className="hero-title">ისტორია, რომელიც გპასუხობს.</h1>
        <p className="hero-lead">
          <strong>მთავარი გმირი შენ ხარ.</strong> ნელ-ნელა გაჩენილი სიყვარული, ფენტეზი თავგადასავალი ან
          მეგობარი, რომელიც ღამის ორ საათზეც აგიღებს ტელეფონს. სცენარი არ არსებობს: შენი ყოველი შეტყობინება ისტორიას ახალი მიმართულებით წაიყვანს.
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
              <span className="eyebrow">✦ დღის რჩეული</span>
              <h2>რა ისტორია გინდა დღეს?</h2>
              <p className="section-sub">აირჩიე დღის ერთ-ერთი ისტორია და მაშინვე დაიწყე.</p>
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
            <h2>სიუჟეტები და განწყობები</h2>
            <p className="section-sub">გაფილტრე ჟანრის ან განწყობის მიხედვით, ან მოძებნე შენი იდეალური პერსონაჟი.</p>
          </div>
          <label className="search">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ძებნა სახელით, ჟანრით, განწყობით…"
              aria-label="ისტორიების ძებნა"
            />
          </label>
        </div>

        <div className="filter-row">
          <span className="filter-label">განწყობა:</span>
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
            <h3>შექმენი შენი იდეალური პერსონაჟი</h3>
            <p>გყავს საყვარელი გამოგონილი პერსონაჟი? ჩაწერე სახელი, აღწერე ხასიათი და ისტორია მაშინვე დაიწყება.</p>
            <button className="btn-outline" onClick={onCreate}>პერსონაჟის შექმნა <span aria-hidden="true">→</span></button>
          </article>

          {visible.map((c) => (
            <StoryCard key={c.id} character={c} onOpen={onOpen} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="empty">ასეთი ისტორია ვერ მოიძებნა. სცადე სხვა განწყობა ან საძიებო სიტყვა.</p>
        )}
      </section>

      <footer className="site-footer">Story Chat · ისტორია, სადაც გადაწყვეტილებებს შენ იღებ</footer>
    </main>
  )
}
