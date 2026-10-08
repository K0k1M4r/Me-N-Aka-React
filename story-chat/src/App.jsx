import { useEffect, useState } from 'react'
import { starterCharacters } from './data/characters.js'
import { fanCharacters } from './data/fanCharacters.js'
import { SHOW_FAN_CHARACTERS } from './config.js'
import { load, save } from './lib/storage.js'
import Header from './components/Header.jsx'
import AgeGate from './components/AgeGate.jsx'
import Home from './components/Home.jsx'
import ChatScreen from './components/ChatScreen.jsx'
import CreateCharacter from './components/CreateCharacter.jsx'

// Older versions saved only a name; turn that into a profile.
function loadProfile() {
  const profile = load('profile', null)
  if (profile) return profile
  const oldName = load('userName', null)
  return oldName ? { name: oldName, pronouns: 'they/them' } : null
}

export default function App() {
  const [profile, setProfile] = useState(loadProfile)
  const [editingProfile, setEditingProfile] = useState(false)
  const [customCharacters, setCustomCharacters] = useState(() => load('customCharacters', []))
  // Which screen is showing: 'stories', 'create', or 'chat'
  const [screen, setScreen] = useState('stories')
  const [activeId, setActiveId] = useState(null)

  useEffect(() => save('customCharacters', customCharacters), [customCharacters])

  const allCharacters = [
    ...starterCharacters,
    ...(SHOW_FAN_CHARACTERS ? fanCharacters : []),
    // Characters made in older versions are missing some fields; fill them in.
    ...customCharacters.map((c) => ({
      role: c.tagline || 'A character of your own making',
      genre: 'Your Character',
      category: 'custom',
      moods: [],
      storyTitle: `A Story with ${c.name}`,
      description: c.personality,
      tags: [],
      custom: true,
      ...c,
    })),
  ]
  const activeCharacter = allCharacters.find((c) => c.id === activeId)

  if (!profile || editingProfile) {
    return (
      <AgeGate
        initial={profile}
        onEnter={(next) => {
          save('profile', next)
          setProfile(next)
          setEditingProfile(false)
        }}
      />
    )
  }

  if (screen === 'chat' && activeCharacter) {
    return (
      <ChatScreen
        key={activeCharacter.id}
        character={activeCharacter}
        profile={profile}
        onBack={() => setScreen('stories')}
      />
    )
  }

  function openStory(id) {
    setActiveId(id)
    setScreen('chat')
    window.scrollTo(0, 0)
  }

  return (
    <>
      <Header
        screen={screen}
        profile={profile}
        onNavigate={setScreen}
        onEditProfile={() => setEditingProfile(true)}
      />
      {screen === 'create' ? (
        <CreateCharacter
          onCancel={() => setScreen('stories')}
          onCreate={(character) => {
            setCustomCharacters((list) => [...list, character])
            openStory(character.id)
          }}
        />
      ) : (
        <Home
          characters={allCharacters}
          onOpen={openStory}
          onCreate={() => setScreen('create')}
        />
      )}
    </>
  )
}
