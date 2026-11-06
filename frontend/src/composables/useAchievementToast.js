import { ref } from 'vue'

const currentAchievement = ref(null)
const achievementQueue = ref([])

function showNextAchievement() {
    if (currentAchievement.value || achievementQueue.value.length === 0) {
        return
    }

    currentAchievement.value = achievementQueue.value.shift()

    setTimeout(() => {
        currentAchievement.value = null

        // Visa nästa achievement efter en kort paus
        setTimeout(showNextAchievement, 300)
    }, 4000)
}

function showAchievements(achievements) {
    if (!Array.isArray(achievements) || achievements.length === 0) {
        return
    }

    achievementQueue.value.push(...achievements)
    showNextAchievement()
}

export function useAchievementToast() {
    return {
        currentAchievement,
        showAchievements
    }
}