<template>
  <button
    :id="id"
    :value="value"
    type="button"
    class="button"
    :class="buttonClass"
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
      default: 'primary'
    }
  },
  data(){
    return {
      customClass: 'button--primary',
    }
  },
  computed: {
    buttonClass() {
      return {
        'button--primary': this.color === 'primary',
        'button--secondary': this.color === 'secondary'
      };
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
  
  width: 100%;
  height: 46px;
  border-radius: 8px;
  border: none;

  font-size: 14px;
  font-weight: 400;
  line-height: 14px;

  background: var(--color-primary);
  color: var(--color-background);
  
  &--primary {
    color: var(--color-background);
    background: var(--color-primary);
  }

  &--secondary {
    background: var(--color-primary);
    color: var(--color-text);
  }
}
</style>
