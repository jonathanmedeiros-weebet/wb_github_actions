<template>
  <div class="button">
    <button
      :id="id"
      :value="value"
      :text="text"
      type="button"
      :class="customClass"
      @click="handleClick"
    >
      {{text}}
    </button>
  </div>
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
    customClass: {
      type: String,
      default: 'button button__item'
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
  padding: 10px;

  &__item {
    color: var(--color-text-input);

    &--active {
      color: var(--color-primary);
      border-bottom: 1px solid var(--color-primary);
      
    }
  }

  &__item:hover {
    background-color: rgb(3, 181, 110);
  }
}
</style>
