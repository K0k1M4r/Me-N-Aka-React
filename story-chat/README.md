# Story Chat

An interactive AI story app: pick a character, chat, and shape the story.

## Setup
1. `npm install`
2. Copy `.env.example` to `.env` and paste your Gemini key from https://aistudio.google.com/apikey
3. `npm run dev` and open the link it prints

## Where things live
- `src/data/characters.js` — the starter characters
- `src/lib/gemini.js` — talks to Gemini, builds the character prompt, summarizes old messages (memory)
- `src/lib/storage.js` — saves chats and custom characters in localStorage
- `src/components/` — the screens: AgeGate, CharacterList, CreateCharacter, ChatScreen

## Note on the API key
The key is added by Vite's dev-server proxy (`vite.config.js`), so it never reaches the browser.
That proxy only exists during `npm run dev`. To deploy, you'll need a small server function
(e.g. on Vercel or Netlify) that does the same job.
