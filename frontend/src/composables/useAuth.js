import { ref, readonly } from 'vue'

const API_URL = 'http://localhost:3000/api/auth'
const SERVER_UNREACHABLE = 'Kunde inte nå servern. Försök igen senare.'

// Skapas en gång när filen laddas och delas därför av alla komponenter som anropar useAuth().
const currentUser = ref(null)

/**
 * fetchMe frågar backend vem som är inloggad (via session-cookien) och uppdaterar
 * currentUser. Utloggad (401) eller nätverksfel ger null.
 */
async function fetchMe() {
  try {
    const response = await fetch(`${API_URL}/me`, {
      credentials: 'include',
      signal: AbortSignal.timeout(5000),
    })
    currentUser.value = response.ok ? await response.json() : null
  } catch (error) {
    console.error('Kunde inte hämta inloggad användare:', error)
    currentUser.value = null
  }
}

/**
 * login skickar inloggningsuppgifterna till backend. Vid lyckad inloggning sätts
 * currentUser och användaren returneras. Annars kastas ett fel med backendens
 * meddelande, så att formuläret kan visa det.
 */
async function login(identifier, password) {
  let response
  try {
    response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })
  } catch {
    throw new Error(SERVER_UNREACHABLE)
  }

  const data = await response.json().catch(() => null)
  if (!response.ok || !data) {
    throw new Error(data?.error ?? 'Inloggningen misslyckades')
  }

  currentUser.value = data
  return data
}

/**
 * logout loggar ut på servern och nollställer currentUser. currentUser nollställs
 * även om anropet misslyckas, så att ingen ser sig som inloggad efter att ha loggat ut.
 */
async function logout() {
  let response
  try {
    response = await fetch(`${API_URL}/logout`, { method: 'POST', credentials: 'include' })
  } catch {
    throw new Error(SERVER_UNREACHABLE)
  }

  if (!response.ok) {
    throw new Error('Utloggningen misslyckades. Försök igen.')
  }

  currentUser.value = null
}

/**
 * useAuth ger komponenter tillgång till den inloggade användaren och funktionerna
 * som ändrar den. currentUser är skrivskyddad utanför den här filen.
 */
export function useAuth() {
  return {
    currentUser: readonly(currentUser),
    fetchMe,
    login,
    logout,
  }
}