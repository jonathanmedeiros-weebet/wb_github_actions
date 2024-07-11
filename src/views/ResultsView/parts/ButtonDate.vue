<template>
    <button
      :id="id"
      :value="value"
      :text="text"
      type="button"
      class="button" 
      :class="{ 'button--active': actived }"
      @click="handleClick"
    >
      {{text}}
    </button>
</template>

<script>

export default {
  name: 'w-button-date-result',
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
    actived: {
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
  align-items: center;
  border: none;
  background: transparent;
  font-size: 16px;
  font-weight: 500;
  padding: 16px 10px;
  color: var(--color-text-input);

  &--active {
    color: var(--color-primary);
    border-bottom: 1px solid var(--color-primary);
  }
}
</style>
