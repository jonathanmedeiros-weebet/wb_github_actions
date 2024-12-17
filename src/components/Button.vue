<template>
  <button
    :id="id"
    :value="value"
    type="button"
    class="button"
    :class="`button--${color}`"
    :disabled="disabled"
    @click="handleClick"
  >
    <slot name="icon-left"></slot>
    {{text}}
    <slot name="icon-right"></slot>
  </button>
</template>

<script>
export default {
  name: 'w-button',
  props: {
    id: {
      type: String,
    },
    text: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: 'button'
    },
    color: {
      type: String,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick(){
      this.$emit('click', this.value);
    }
  }
}
</script>

<style lang="scss" scoped>
.button {
  display: flex;
  gap: 8px;
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 46px;
  width: 100%;
  border-radius: 8px;
  border: none;
  
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;

  color: #181818;
  color: var(--foreground-highlight);
  background: #35cd96;
  background: var(--highlight);
  
  &--primary {
    color: #181818;
    color: var(--foreground-highlight);
    background: #35cd96;
    background: var(--highlight);
  }

  &--secondary {
    color: #ffffff;
    color: var(--foreground-league);
    background: #0a0a09;
    background: var(--league);
  }
  &--secondary-light {
    color: #ffffff;
    color: var(--foreground-header);
    background: #0a0a09;
    background: var(--header);
  }
}

.button:disabled {
  opacity: 0.3;
}
</style>
