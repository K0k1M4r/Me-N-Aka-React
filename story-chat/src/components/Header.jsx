import { genderLabel } from '../data/profile.js'

const TABS = [
  { id: 'stories', label: 'ისტორიები', icon: '✦' },
  { id: 'create', label: 'შექმენი პერსონაჟი', icon: '+' },
]

export default function Header({ screen, profile, onNavigate, onEditProfile }) {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <button className="brand" onClick={() => onNavigate('stories')}>
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span className="brand-text">
            <span className="brand-name">Story <em>Chat</em></span>
            <span className="brand-sub">AI ისტორიები და პერსონაჟები</span>
          </span>
        </button>

        <nav className="tabs" aria-label="მთავარი მენიუ">
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

        <button className="profile-chip" onClick={onEditProfile} title="პროფილის შეცვლა">
          <span className="profile-initial" aria-hidden="true">{profile.name.charAt(0).toUpperCase()}</span>
          <span className="profile-text">
            <span className="profile-name">{profile.name}</span>
            <span className="profile-pronouns">{genderLabel(profile.pronouns)}</span>
          </span>
        </button>
      </div>
    </header>
  )
}
