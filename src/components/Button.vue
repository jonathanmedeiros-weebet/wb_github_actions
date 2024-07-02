<template>
  <button
    :id="id"
    :value="value"
    type="button"
    class="button"
    @click="handleClick"
  >
    {{ text }}
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
      default: 'secondary'
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
  justify-content: center;
  align-items: center;
  padding: 10px;
  height: 46px;
  border-radius: 8px;
  border: none;
  
  font-size: 14px;
  font-weight: 400;
  line-height: 14px;

  color: var(--color-background);
  background: var(--color-primary);
  
  &--primary {
    color: var(--color-background);
    background: var(--color-primary);
  }

  &--secondary {
    color: var(--color-text);
    background: var(--color-background);
  }
}
</style>
