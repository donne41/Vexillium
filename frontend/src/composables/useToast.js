import { ref, readonly } from 'vue'

const DEFAULT_DURATION_MS = 3000

// Ett meddelande i taget som delas av hela appen: { text, type } eller null.
const toast = ref(null)
let hideTimer = null

/**
 * showToast visar ett kort meddelande som försvinner av sig självt.
 * type är 'success' (grön) eller 'error' (röd).
 */
function showToast(text, type = 'success', duration = DEFAULT_DURATION_MS) {
    clearTimeout(hideTimer)
    toast.value = {text, type }
    hideTimer = setTimeout(() => {
        toast.value = null
    }, duration)
}

/**
 * hideToast stänger meddelandet direkt, t.ex. när användaren klickar på stängknappen.
 */
function hideToast() {
    clearTimeout(hideTimer)
    toast.value = null
}

export function useToast() {
    return { toast: readonly(toast), showToast, hideToast }
}