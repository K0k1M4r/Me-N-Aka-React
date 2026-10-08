import Cover from './Cover.jsx'

// variant="spotlight" = big featured card, variant="grid" = normal card.
export default function StoryCard({ character: c, variant = 'grid', onOpen }) {
  const isSpotlight = variant === 'spotlight'

  return (
    <article
      className={'story-card story-card-' + variant}
      style={{ '--c1': c.colors[0], '--c2': c.colors[1] }}
    >
      <Cover character={c} className={isSpotlight ? 'cover-inset' : ''}>
        <span className="genre-pill">{c.genre}</span>
        <div className="cover-caption">
          {isSpotlight && <span className="cover-role">{c.role}</span>}
          <span className="cover-name">{c.name}</span>
          {!isSpotlight && <span className="cover-role-small">{c.role}</span>}
        </div>
      </Cover>

      <div className="story-body">
        <h3 className="story-title">{c.storyTitle}</h3>
        {isSpotlight && c.quote && <blockquote className="story-quote">"{c.quote}"</blockquote>}
        <p className="story-desc">{c.description}</p>
        {!isSpotlight && c.tags?.length > 0 && (
          <ul className="story-tags">
            {c.tags.map((t) => <li key={t}>{t}</li>)}
          </ul>
        )}
      </div>

      <footer className="story-footer">
        <span className="story-meta">{c.fan ? 'Fan character' : c.custom ? 'Your character' : 'Ready to play'}</span>
        <button className={isSpotlight ? 'btn-primary btn-small' : 'btn-link'} onClick={() => onOpen(c.id)}>
          Start Story <span aria-hidden="true">→</span>
        </button>
      </footer>
    </article>
  )
}
