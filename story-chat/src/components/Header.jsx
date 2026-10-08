const TABS = [
  { id: 'stories', label: 'Stories & Companions', icon: '✦' },
  { id: 'create', label: 'Dream Character', icon: '+' },
]

export default function Header({ screen, profile, onNavigate, onEditProfile }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="brand" onClick={() => onNavigate('stories')}>
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span className="brand-text">
            <span className="brand-name">Story <em>Chat</em></span>
            <span className="brand-sub">Endless AI stories & companions</span>
          </span>
        </button>

        <nav className="tabs" aria-label="Main">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={'tab' + (screen === t.id ? ' is-active' : '')}
              aria-current={screen === t.id ? 'page' : undefined}
              onClick={() => onNavigate(t.id)}
            >
              <span className="tab-icon" aria-hidden="true">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>

        <button className="profile-chip" onClick={onEditProfile} title="Edit profile">
          <span className="profile-initial" aria-hidden="true">{profile.name.charAt(0).toUpperCase()}</span>
          <span className="profile-text">
            <span className="profile-name">{profile.name}</span>
            <span className="profile-pronouns">{profile.pronouns}</span>
          </span>
        </button>
      </div>
    </header>
  )
}
