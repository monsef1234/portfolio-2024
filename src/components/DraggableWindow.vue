<template>
  <div
    ref="el"
    :style="[props.disabled ? `left: ${props.initialX}px; top: ${props.initialY}px;` : style, { zIndex: props.zIndex }]"
    class="fixed"
    style="touch-action: none"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDraggable } from '@vueuse/core'

const props = defineProps<{
  initialX: number;
  initialY: number;
  zIndex?: number;
  disabled?: boolean;
}>()

const el = ref<HTMLElement | null>(null)

const { style } = useDraggable(el, {
  initialValue: { x: props.initialX, y: props.initialY },
  preventDefault: true,
})
</script>
