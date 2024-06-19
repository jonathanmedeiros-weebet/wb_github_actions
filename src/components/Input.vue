<template>
  <div class="input">
    <label class="input__label" :for="name">{{ label }}</label>
    <div class="input__group">
      <div class="input__icon" v-if="$slots['icon']">
        <slot name="icon"></slot>
      </div>
      <input
        :id="name"
        :name="name"
        :value="value"
        :placeholder="placeholder"
        @input="handleInput"
        class="input__field"
        :type="type"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'w-input',
  props: {
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    }
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.input {
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;

  &__label {
    font-weight: 400;
    font-size: 16px;
    color: #FFFFFF;
    margin-bottom: 6px;
  }

  &__group {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
  }

  &__icon {
    display: flex;
    align-items: center;
    z-index: 1;
  }

  &__field {
    width: 100%;
    height: 56px;
    background-color: #181818;
    border: none;
    outline: 0;
    box-shadow: none;
    -moz-box-shadow: none;
    -webkit-box-shadow: none;
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    padding-left: 30px;
    
    margin-left: -20px;
  }
}
</style>