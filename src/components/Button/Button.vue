<template>
  <button type="button" :class="classes" @click="onClick" :style="style">
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { ButtonProps } from './button.interface';

const props = withDefaults(
  defineProps<ButtonProps>(),
  { primary: false }
);

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>();

const classes = computed(() => ({
  'wee-button': true,
  'wee-button--primary': props.primary,
  'wee-button--secondary': !props.primary,
  [`wee-button--${props.size || 'medium'}`]: true,
}));

const onClick = () => emit('click', 1);

const style = computed(() => ({
  backgroundColor: props.backgroundColor || undefined
}));
</script>

<style scoped lang="scss">
.wee-button {
  display: flex;
  height: 32px;
  padding: 8px 12px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;

  &--primary {
    background-color: var(--primary);
    color: var(--secondary);
    border-color: var(--primary);
  }

  &--secondary {
    background-color: var(--secondary);
    color: var(--primary);
    border-color: var(--primary);
  }

  &--small {
    padding: 10px 16px;
    font-size: 12px;
  }

  &--medium {
    padding: 11px 20px;
    font-size: 14px;
  }

  &--large {
    padding: 12px 24px;
    font-size: 16px;
  }
}
</style>