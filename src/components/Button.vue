<template>
  <div class="button">
    <button
      :id="id"
      :value="value"
      type="button"
      class="button__item"
      @click="handleClick"
    >
      {{text}}
    </button>
  </div>
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
  &__item {
    width: 100%;
    height: 46px;
    border-radius: 8px 8px 8px 8px;
    border: none;
    background: var(--color-primary);
    color: rgba(10, 10, 10, 1);
    font-size: 14px;
    font-weight: 400;
    line-height: 16.41px;
  }

  &__item:hover {
    background-color: rgb(3, 181, 110);
  }
}
</style>
