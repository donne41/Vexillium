<script setup>
import { useToast } from '../composables/useToast'
import '@/assets/css/ToastMessage.css'

const { toast, hideToast } = useToast()
</script>

<template>
  <div class="toast-region" aria-live="polite">
    <Transition name="toast">
      <div v-if="toast" class="toast-message" :class="`toast-${toast.type}`">
        <span>{{ toast.text }}</span>
        <button type="button" class="toast-close" aria-label="Stäng meddelande" @click="hideToast">
          ×
        </button>
      </div>
    </Transition>
  </div>
</template>