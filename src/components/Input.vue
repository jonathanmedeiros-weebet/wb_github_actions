<template>
  <div class="input">
    <label class="input__label" :for="name">{{ label }}</label>
    <div class="input__group" :class="{ 'input__group--focused': isFocused }">
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
        
        @focus="handleFocus"
        @blur="handleBlur"
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
  data() {
    return {
      isFocused: false,
    };
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value)
    },
    handleFocus(){
      this.isFocused = true;
    },
    handleBlur(){
      this.isFocused = false;
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
    padding-left: 10px;
    background-color: #181818;
    border-radius: 5px;

    &--focused {
      border: 2px solid var(--color-primary);
    }

  }

  &__icon {
    display: flex;
    align-items: center;
    z-index: 1;
  }

  &__field {
    width: 100%;
    height: 56px;
    
    font-size: 14px;
    font-weight: 400;
    color: rgba(255, 255, 255, 0.5);
    padding-left: 10px;
    
  }
}
</style>