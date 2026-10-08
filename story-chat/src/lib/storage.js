// Tiny wrapper around localStorage so a broken or full storage
// never crashes the app.
const PREFIX = 'storychat:'

export function load(key, fallback) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw === null ? fallback : JSON.parse(raw)
  } catch {
    return fallback
  }
}

export function save(key, value) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    // Storage full or blocked — the app keeps working, it just won't remember.
  }
}
