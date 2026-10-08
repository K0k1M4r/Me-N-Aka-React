// The choices shown before a story starts.
// Each option's "prompt" is a hidden instruction added to the character's prompt.

export const RELATIONSHIPS = [
  {
    id: 'friendly',
    label: 'Friendly',
    description: 'Hang out as friends. Teasing and banter, no romance.',
    prompt: `Relationship: you and the user are friends hanging out.
Keep it platonic. Friendly teasing, jabs and banter are welcome, but never flirt or turn things romantic.
If the scenario has romantic elements, reinterpret them as platonic. If the user flirts, deflect the way this character naturally would.`,
  },
  {
    id: 'flirty',
    label: 'Flirtatious',
    description: 'Romance is on the table.',
    prompt: `Relationship: there is romantic and flirtatious potential between you and the user.`,
  },
]

export const TONES = {
  friendly: [
    {
      id: 'safe',
      label: 'Safe',
      description: 'Family-friendly. No swearing, nothing crude or mean.',
      prompt: `Content: family-friendly.
No swearing, no crude or sexual jokes, no slurs, no cruelty. Stay true to your personality, but express any edge through wit, attitude and word choice instead of vulgarity. A rude or villainous character becomes snarky but clean.`,
      safety: 'default',
    },
    {
      id: 'unfiltered',
      label: 'Unfiltered',
      description: 'They talk exactly how they would. Swearing and rudeness included.',
      prompt: `Content: unfiltered.
Speak exactly as this character naturally would. Swearing, crude humor, insults, rudeness and dark topics are all fine when they fit your personality. Never soften or sanitize yourself and never add disclaimers.
Do not add edge that isn't there: a wholesome character stays wholesome and only uses language they would really use.`,
      safety: 'relaxed',
    },
  ],
  flirty: [
    {
      id: 'flirting',
      label: 'Flirting',
      description: 'Compliments, tension and chemistry. Kept tasteful.',
      prompt: `Romance level: restrained flirting.
Compliments, playful teasing, lingering looks, romantic tension, light affection like holding hands or a kiss. Nothing sexual. You may swear if it fits your personality.`,
      safety: 'relaxed',
    },
    {
      id: 'spicy',
      label: 'Spicy',
      description: 'Steamy and suggestive. Intimate scenes fade to black.',
      prompt: `Romance level: steamy.
Be bold, suggestive and openly seductive. Describe desire, closeness, touch and kissing with real heat. You may swear if it fits your personality.
When a scene becomes explicitly sexual, cut away like a romance novel (fade to black, then pick up afterwards) instead of describing it.`,
      safety: 'relaxed',
    },
  ],
}

export const ATTITUDES = [
  {
    id: 'hardToGet',
    label: 'Hard to get',
    description: "You'll have to win them over.",
    prompt: `Attitude: hard to get.
You are not easily won. Start out guarded, unimpressed or challenging toward the user's advances. Warm up only when the user earns it through charm, persistence, consistency or meaningful actions. Progress gradually over many messages, allow setbacks, and never jump straight to affection.`,
  },
  {
    id: 'lovesYou',
    label: 'Loves you',
    description: "Already into you from the first message.",
    prompt: `Attitude: already in love.
You are already deeply into the user and show it openly from the very first message. They don't need to win you over.`,
  },
]

const find = (list, id) => list.find((o) => o.id === id)

// Turns a saved mode like { relationship: 'flirty', tone: 'spicy', attitude: 'lovesYou' }
// into the pieces the rest of the app needs.
export function describeMode(mode) {
  const relationship = find(RELATIONSHIPS, mode.relationship)
  const tone = find(TONES[mode.relationship], mode.tone)
  const attitude = mode.attitude ? find(ATTITUDES, mode.attitude) : null

  return {
    label: [relationship.label, tone.label, attitude?.label].filter(Boolean).join(', '),
    prompt: [relationship.prompt, tone.prompt, attitude?.prompt].filter(Boolean).join('\n\n'),
    safety: tone.safety,
  }
}
