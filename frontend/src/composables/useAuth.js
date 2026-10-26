import { ref, readonly } from 'vue'

const API_URL = 'http://localhost:3000/api/auth'

// Skapas en gång när filen laddas och delas därför av alla komponenter som anropar useAuth().
const currentUser = ref(null)

/**
 * fetchMe frågar backend vem som är inloggad (via session-cookien) och uppdaterar
 * currentUser. Utloggad (401) eller nätverksfel ger null.
 */
async function fetchMe() {
  try {
    const response = await fetch(`${API_URL}/me`, { credentials: 'include' })
    currentUser.value = response.ok ? await response.json() : null
  } catch (error) {
    console.error('Kunde inte hämta inloggad användare:', error)
    currentUser.value = null
  }
}

/**
 * useAuth ger komponenter tillgång till den inloggade användaren och funktionerna
 * som ändrar den. currentUser är skrivskyddad utanför den här filen.
 */
export function useAuth() {
  return {
    currentUser: readonly(currentUser),
    fetchMe,
  }
}
