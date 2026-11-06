// Quizkategorierna i samma ordning som på startsidan. key är värdet i
// game_results.category och i adressen /quiz/:quizType.
export const QUIZ_CATEGORIES = [
  { key: 'flags', label: 'Flaggor' },
  { key: 'capitals', label: 'Huvudstäder' },
  { key: 'neighbours', label: 'Grannländer' },
  { key: 'population', label: 'Befolkning' },
  { key: 'area', label: 'Yta' },
  { key: 'language', label: 'Språk' },
]

/**
 * categoryLabel ger kategorins svenska namn, eller nyckeln själv om kategorin är okänd.
 */
export function categoryLabel(key) {
  return QUIZ_CATEGORIES.find((category) => category.key === key)?.label ?? key
}
