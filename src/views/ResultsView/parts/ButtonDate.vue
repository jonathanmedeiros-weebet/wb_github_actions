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
  color: #ffffff80;
  color: var(--foreground-league);
  outline: none;

  &--active {
    color: #35cd96;
    color: var(--highlight);
    border-bottom: 1px solid #35cd96;
    border-bottom: 1px solid var(--highlight);

  }

  &:focus {
    outline: none;
  }
}
</style>
