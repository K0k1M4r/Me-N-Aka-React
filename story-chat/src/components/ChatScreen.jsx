import { useEffect, useRef, useState } from 'react'
import Avatar from './Avatar.jsx'
import ModePicker from './ModePicker.jsx'
import { load, save } from '../lib/storage.js'
import { describeMode } from '../data/modes.js'
import { generateReply, summarize, RECENT_WINDOW, SUMMARIZE_AFTER } from '../lib/gemini.js'

// Turns "*smiles* Hello" into an italic action + normal dialogue.
function StoryText({ text }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean)
  return parts.map((part, i) =>
    part.startsWith('*') && part.endsWith('*') ? (
      <em key={i} className="action">{part.slice(1, -1)}</em>
    ) : (
      <span key={i}>{part}</span>
    )
  )
}

function emptyChat(mode = null) {
  return {
    mode, // null until the user picks one
    messages: [],
    memory: '', // summary of older messages
    summarizedCount: 0, // how many messages are already inside "memory"
  }
}

export default function ChatScreen({ character, profile, onBack }) {
  const storageKey = 'chat:' + character.id
  const [chat, setChat] = useState(() => {
    const saved = load(storageKey, null)
    return saved?.mode ? saved : emptyChat() // old chats without a mode start fresh
  })
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const bottomRef = useRef(null)

  // Save every change so the story survives a page refresh.
  useEffect(() => save(storageKey, chat), [storageKey, chat])

  // Scroll to the newest message.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chat.messages.length, isTyping])

  async function requestReply(currentChat) {
    setIsTyping(true)
    setError(null)
    try {
      // Only send messages that aren't already summarized into memory.
      const recent = currentChat.messages.slice(currentChat.summarizedCount)
      const reply = await generateReply({
        character,
        profile,
        mode: currentChat.mode,
        memory: currentChat.memory,
        messages: recent,
      })

      let next = { ...currentChat, messages: [...currentChat.messages, { role: 'character', text: reply }] }

      // Too many unsummarized messages? Fold the older ones into memory.
      const unsummarized = next.messages.length - next.summarizedCount
      if (unsummarized > SUMMARIZE_AFTER) {
        const cutoff = next.messages.length - RECENT_WINDOW
        const toFold = next.messages.slice(next.summarizedCount, cutoff)
        const memory = await summarize({ character, mode: next.mode, previousMemory: next.memory, messages: toFold })
        next = { ...next, memory, summarizedCount: cutoff }
      }

      setChat(next)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsTyping(false)
    }
  }

  function handlePickMode(mode) {
    const fresh = emptyChat(mode)
    setChat(fresh)
    requestReply(fresh) // the character writes an opening that fits the mode
  }

  function handleSend(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isTyping) return
    const next = { ...chat, messages: [...chat.messages, { role: 'user', text }] }
    setChat(next)
    setInput('')
    requestReply(next)
  }

  function handleRestart() {
    if (confirm('დავიწყოთ ისტორია თავიდან? ჩატი და პერსონაჟის მეხსიერება წაიშლება, რეჟიმს კი ხელახლა აირჩევ.')) {
      setError(null)
      setChat(emptyChat())
    }
  }

  if (!chat.mode) {
    return <ModePicker character={character} onPick={handlePickMode} onBack={onBack} />
  }

  return (
    <div className="chat" style={{ '--c1': character.colors[0], '--c2': character.colors[1] }}>
      <header className="topbar chat-topbar">
        <button className="btn-ghost" onClick={onBack} aria-label="პერსონაჟებთან დაბრუნება">უკან</button>
        <Avatar character={character} size={36} />
        <div className="chat-title">
          <h1>{character.name}</h1>
          <span className="mode-label">{describeMode(chat.mode).label}</span>
        </div>
        <button className="btn-ghost" onClick={handleRestart}>თავიდან</button>
      </header>

      <ol className="messages">
        {chat.memory && (
          <li className="memory-note">
            მეხსიერებაში შენახულია {chat.summarizedCount} ადრინდელი შეტყობინება
          </li>
        )}
        {chat.messages.map((m, i) => (
          <li key={i} className={'msg msg-' + m.role}>
            <StoryText text={m.text} />
          </li>
        ))}
        {isTyping && (
          <li className="msg msg-character typing" aria-label={`${character.name} წერს…`}>
            <span /><span /><span />
          </li>
        )}
        {error && (
          <li className="error">
            <p>{error}</p>
            <button className="btn-ghost" onClick={() => requestReply(chat)}>ხელახლა ცდა</button>
          </li>
        )}
        <li ref={bottomRef} aria-hidden="true" />
      </ol>

      <form className="composer" onSubmit={handleSend}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) handleSend(e)
          }}
          rows={1}
          placeholder="თქვი რამე, ან *გააკეთე რამე*"
          aria-label="შენი შეტყობინება"
        />
        <button className="btn-primary" disabled={!input.trim() || isTyping || chat.messages.length === 0}>გაგზავნა</button>
      </form>
    </div>
  )
}
