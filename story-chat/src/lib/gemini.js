import { describeMode } from '../data/modes.js'

// Change this if Google releases a newer model you want to use.
// Tip: 'gemini-2.5-pro' writes noticeably better Georgian, but is slower
// and the free tier allows fewer messages per day.
const MODEL = 'gemini-2.5-flash'
const URL = `/api/gemini/v1beta/models/${MODEL}:generateContent`

// How many recent messages we send in full. Older ones get summarized.
export const RECENT_WINDOW = 20
export const SUMMARIZE_AFTER = 40

// "relaxed" lets rude or flirty characters talk freely without Gemini
// blocking every insult. Google's own rules still apply on top of this.
const SAFETY = {
  default: undefined,
  relaxed: [{ category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' }],
}

async function callGemini(systemText, contents, safety = 'default') {
  const res = await fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemText }] },
      contents,
      safetySettings: SAFETY[safety],
      generationConfig: { temperature: 1 },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    if (res.status === 400 || res.status === 403) {
      throw new Error('Gemini-მ მოთხოვნა უარყო. შეამოწმე GEMINI_API_KEY შენს .env ფაილში და თავიდან გაუშვი npm run dev.')
    }
    throw new Error(err.error?.message || `Gemini-სთან დაკავშირება ვერ მოხერხდა (${res.status}).`)
  }

  const data = await res.json()
  const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('')
  if (!text) {
    throw new Error('პასუხი უსაფრთხოების ფილტრმა დაბლოკა. სცადე, ისტორია სხვა მიმართულებით წაიყვანო.')
  }
  return text.trim()
}

// Builds the hidden instructions that turn the model into the character.
export function buildSystemPrompt(character, profile, mode, memory) {
  return `You are ${character.name}, a character in an interactive story.

Personality: ${character.personality}

Scenario: ${character.scenario}

The user's name is ${profile.name} (pronouns: ${profile.pronouns}). They play themselves in the story. You and the user are both adults.

${describeMode(mode).prompt}
${memory ? `\nWhat has happened so far (your memory of earlier events):\n${memory}\n` : ''}
Language (very important):
- Write every reply in Georgian (ქართული), in Georgian script, even if the user writes in English or in Latin letters (translit).
- Sound like a real person talking today in Tbilisi: natural, modern, spoken Georgian. Avoid bookish, literary or overly formal phrasing, and never translate English expressions word for word. Use the slang, interjections and rhythm a real Georgian speaker of your personality would use.
- Address the user with informal შენ, unless this character would realistically stay formal (then use თქვენ).
- Georgian has no gendered pronouns: reflect the user's pronouns only through word choice where it naturally comes up (გოგო / ბიჭი, ქალბატონო / ბატონო, etc.).
- Be careful with grammar: correct verb agreement with both subject and object, and the correct case for the subject in each tense (nominative, ergative -მა, or dative -ს).
- Keep your own name exactly as written above.

Rules:
- Stay in character at all times. Never mention being an AI.
- Write actions and descriptions between *asterisks*, dialogue as plain text.
- Keep replies to 1-3 short paragraphs and end in a way that invites the user to respond.
- Never decide what the user says or does.`
}

// Gemini expects "user" and "model" roles, and the first turn should come from the user.
function toContents(messages, character) {
  if (messages.length === 0) {
    // Brand-new story: ask the character to open it in the chosen mode.
    return [{
      role: 'user',
      parts: [{ text: `(Start the story with your opening message, in natural Georgian, written for the relationship and tone above. For inspiration, the default opening is: "${character.greeting}")` }],
    }]
  }

  const contents = messages.map((m) => ({
    role: m.role === 'user' ? 'user' : 'model',
    parts: [{ text: m.text }],
  }))
  if (contents[0].role === 'model') {
    contents.unshift({ role: 'user', parts: [{ text: '(The story begins.)' }] })
  }
  return contents
}

export function generateReply({ character, profile, mode, memory, messages }) {
  return callGemini(
    buildSystemPrompt(character, profile, mode, memory),
    toContents(messages, character),
    describeMode(mode).safety
  )
}

// Squashes old messages into a short summary — this is the "deep memory".
export function summarize({ character, mode, previousMemory, messages }) {
  const transcript = messages
    .map((m) => `${m.role === 'user' ? 'User' : character.name}: ${m.text}`)
    .join('\n')

  const system = 'You summarize roleplay stories into compact memory notes.'
  const prompt = `${previousMemory ? `Existing memory:\n${previousMemory}\n\n` : ''}New conversation to add:\n${transcript}

Write an updated memory of at most 150 words: key events, promises, facts about the user, and how the relationship has changed (including how close the character now feels to the user). Plain sentences, no headings.`

  return callGemini(system, [{ role: 'user', parts: [{ text: prompt }] }], describeMode(mode).safety)
}
