/**
 * formatDate visar ett datum från backend på svenska, t.ex. "15 oktober 2026".
 */
export function formatDate(value) {
    return new Date(value).toLocaleDateString('sv-SE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })
}