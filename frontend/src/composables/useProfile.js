import { useAuth } from './useAuth'

const API_URL = 'http://localhost:3000/api'
const SERVER_UNREACHABLE = 'Kunde inte nå servern. Försök igen senare.'
const REQUEST_TIMEOUT_MS = 10000

const { fetchMe } = useAuth()

/**
 * request skickar ett anrop till backend och returnerar svaret som JSON (null vid 204).
 * Vid fel kastas ett Error med backendens svenska meddelande och statuskoden i error.status.
 */
async function request(path, options = {}) {
    let response
    try {
        response = await fetch(`${API_URL}${path}`, {
            credentials: 'include',
            signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
            ...options,
            headers: options.body
                ? { 'Content-Type': 'application/json', ...options.headers }
                : options.headers,
        })
    } catch {
        throw new Error(SERVER_UNREACHABLE)
    }

    if (response.status === 204) {
        return null
    }

    const data = await response.json().catch(() => null)
    if (!response.ok) {
        const error = new Error(data?.error ?? 'Något gick fel. Försök igen.')
        error.status = response.status
        throw error
    }

    return data
}

/**
 * getProfile hämtar en användares publika profil (uppgifter, senaste resultat,
 * kategoristatistik och senaste prestationer). Kräver ingen inloggning.
 */
function getProfile(userId) {
    return request(`/profiles/${userId}`)
}

/**
 * getAccount hämtar kontouppgifterna (inklusive e-post). Bara för ägaren eller admin.
 */
function getAccount(userId) {
    return request(`/users/${userId}`)
}

/**
 * updateAccount sparar ändringar ({ username }, { email, currentPassword } eller
 * { password, currentPassword }) och uppdaterar inloggningsläget så att menyn
 * visar ett nytt användarnamn direkt.
 */
async function updateAccount(userId, changes) {
    const account = await request(`/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(changes),
    })
    await fetchMe()
    return account
}

/**
 * deleteAccount raderar ett konto efter lösenordsbekräftelse. Raderar man sitt eget
 * konto avslutar backend sessionen, och fetchMe nollställer då inloggningsläget.
 */
async function deleteAccount(userId, currentPassword) {
    await request(`/users/${userId}`, {
        method: 'DELETE',
        body: JSON.stringify({ currentPassword }),
    })
    await fetchMe()
}

export function useProfile() {
    return { getProfile, getAccount, updateAccount, deleteAccount }
}