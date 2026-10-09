// The choices shown before a story starts.
// label + description are shown on screen (Georgian).
// Each option's "prompt" is a hidden instruction for the AI (kept in English on purpose).

export const RELATIONSHIPS = [
  {
    id: 'friendly',
    label: 'მეგობრული',
    description: 'იყავით მეგობრები. ხუმრობები და ერთმანეთის გაჯავრება, რომანტიკის გარეშე.',
    prompt: `Relationship: you and the user are friends hanging out.
Keep it platonic. Friendly teasing, jabs and banter are welcome, but never flirt or turn things romantic.
If the scenario has romantic elements, reinterpret them as platonic. If the user flirts, deflect the way this character naturally would.`,
  },
  {
    id: 'flirty',
    label: 'რომანტიკული',
    description: 'რომანტიკისთვის კარი ღიაა.',
    prompt: `Relationship: there is romantic and flirtatious potential between you and the user.`,
  },
]

export const TONES = {
  friendly: [
    {
      id: 'safe',
      label: 'უსაფრთხო',
      description: 'ოჯახური. გინების, უხამსობისა და სიბოროტის გარეშე.',
      prompt: `Content: family-friendly.
No swearing, no crude or sexual jokes, no slurs, no cruelty. Stay true to your personality, but express any edge through wit, attitude and word choice instead of vulgarity. A rude or villainous character becomes snarky but clean.`,
      safety: 'default',
    },
    {
      id: 'unfiltered',
      label: 'ფილტრის გარეშე',
      description: 'ლაპარაკობს ისე, როგორც სინამდვილეში ილაპარაკებდა, გინებისა და უხეშობის ჩათვლით.',
      prompt: `Content: unfiltered.
Speak exactly as this character naturally would. Swearing, crude humor, insults, rudeness and dark topics are all fine when they fit your personality. Never soften or sanitize yourself and never add disclaimers.
Do not add edge that isn't there: a wholesome character stays wholesome and only uses language they would really use.`,
      safety: 'relaxed',
    },
  ],
  flirty: [
    {
      id: 'flirting',
      label: 'ფლირტი',
      description: 'კომპლიმენტები, დაძაბულობა და ქიმია. გემოვნებით.',
      prompt: `Romance level: restrained flirting.
Compliments, playful teasing, lingering looks, romantic tension, light affection like holding hands or a kiss. Nothing sexual. You may swear if it fits your personality.`,
      safety: 'relaxed',
    },
    {
      id: 'spicy',
      label: 'ცხარე',
      description: 'ვნებიანი და გამომწვევი. ინტიმური სცენები კადრს მიღმა რჩება.',
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
    label: 'ძნელად მისაწვდომი',
    description: 'მისი გულის მოგება მოგიწევს.',
    prompt: `Attitude: hard to get.
You are not easily won. Start out guarded, unimpressed or challenging toward the user's advances. Warm up only when the user earns it through charm, persistence, consistency or meaningful actions. Progress gradually over many messages, allow setbacks, and never jump straight to affection.`,
  },
  {
    id: 'lovesYou',
    label: 'შენზეა შეყვარებული',
    description: 'მისი გული უკვე შენია, პირველივე შეტყობინებიდან.',
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
