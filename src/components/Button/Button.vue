<template>
  <button type="button" :class="classes" @click="onClick">
    {{ label }}
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import type { ButtonProps } from './button.interface';

const props = withDefaults(
  defineProps<ButtonProps>(),
  {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
);

const emit = defineEmits<{
  (e: 'click', id: number): void;
}>();

const classes = computed(() => ({
  'wee-button': true,
  [`wee-button--${props.color || 'primary'}`]: true,
  [`wee-button--${props.variant || 'solid'}`]: true,
  [`wee-button--${props.size || 'md'}`]: true,
}));

const onClick = () => emit('click', 1);

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

  &--primary.wee-button--solid {
    color: var(--secondary, #ffffff);
    background-color: var(--primary, #c71f2d);
    border-color: var(--primary, #c71f2d);
  }

  &--secondary.wee-button--solid {
    color: var(--primary, #c71f2d);
    background-color: var(--secondary, #ffffff);
    border-color: var(--secondary, #ffffff);
  }

  &--primary.wee-button--outline,
  &--primary.wee-button--clear {
    color: var(--primary, #c71f2d);
    background-color: var(--secondary, #ffffff);
    border-color: var(--primary, #c71f2d);
  }

  &--secondary.wee-button--outline,
  &--secondary.wee-button--clear {
    color: var(--secondary, #ffffff);
    background-color: var(--primary, #c71f2d);
    border-color: var(--secondary, #ffffff);
  }

  &--clear {
    background-color: transparent;
    border-color: transparent !important;
  }

  &--sm {
    padding: 10px 16px;
    font-size: 12px;
  }

  &--md {
    padding: 11px 20px;
    font-size: 14px;
  }

  &--lg {
    padding: 12px 24px;
    font-size: 16px;
  }
}
</style>