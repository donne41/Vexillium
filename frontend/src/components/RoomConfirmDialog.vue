<script setup>
import { ref, useId } from 'vue'

const props = defineProps({
  title: String,
  description: String,
  label: String,
  error: String,
  busy: Boolean,
  cancelText: String,
  confirmText: String,
})

const emit = defineEmits(['open', 'confirm'])

const dialog = ref(null)
const titleId = useId()

function showModal() {
  if (props.busy) return
  emit('open')
  dialog.value.showModal()
}

function cancel() {
  if (!props.busy) dialog.value.close()
}

defineExpose({
  showModal,
  close: () => dialog.value.close(),
})
</script>

<template>
  <Teleport to="body">
    <dialog
      ref="dialog"
      class="room-close-dialog"
      :aria-labelledby="titleId"
      :aria-describedby="titleId + '-description'"
      :aria-busy="busy"
      @cancel.prevent="cancel"
    >
      <span v-if="label" class="room-close-label">{{ label }}</span>
      <h2 :id="titleId">{{ title }}</h2>
      <p :id="titleId + '-description'">{{ description }}</p>
      <p v-if="error" class="room-close-error" role="alert">{{ error }}</p>

      <div class="room-close-actions">
        <button type="button" class="room-close-cancel" :disabled="busy" autofocus @click="cancel">
          {{ cancelText }}
        </button>

        <button type="button" class="room-close-confirm" :disabled="busy" @click="$emit('confirm')">
          {{ confirmText }}
        </button>
      </div>
    </dialog>
  </Teleport>
</template>
