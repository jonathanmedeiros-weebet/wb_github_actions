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
        :placeholder="placeholder"
        @input="handleInput"
        class="input__field"
        :type="typeInputPassword"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <div class="input__icon__right">
        
        <icon-visibility 
        v-if="showPassword && initType == 'password'"
        @click="passWordVisible"
        color="var(--color-text-input)"
        />
        <icon-visibility-off 
        v-if="!showPassword && initType == 'password'" 
        @click="passWordVisible"
        color="var(--color-text-input)"
        />

      </div>
    </div>
  </div>
</template>

<script>
import IconVisibility from '@/components/icons/IconVisibility.vue'
import IconVisibilityOff from '@/components/icons/iconVisibilityOff.vue'

export default {
  name: 'w-input',
  components: {
    IconVisibility,
    IconVisibilityOff
  },
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
      showPassword: false,
      initType: this.type
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
    },
    passWordVisible() {
      this.showPassword = !this.showPassword;
    },
  },
  computed: {
    password() {
      return this.value;
    },
    typeInputPassword() {
      return this.showPassword ? 'text' : 'password';
    }
  }
}
</script>

<style lang="scss" scoped>

input {
  background-color: var(--color-background-input);
  box-sizing: border-box;
  border: none;
  border-radius: 5px;
  transition: 0.5s;
  outline: none;
  box-shadow: none;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  -webkit-transition: 0.5s;
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-input);
}

.input {
  font-family: 'Roboto', sans-serif;
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;

  &__label {
    font-weight: 400;
    font-size: 16px;
    color: var(--color-text);
    margin-bottom: 6px;
  }

  &__group {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding-left: 10px;
    background-color: var(--color-background-input);
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

  &__icon__right {
    display: flex;
    align-items: right;
    z-index: 1;
    padding-right: 10px;
  }

  &__field {
    width: 100%;
    height: 56px;
    font-size: 14px;
    font-weight: 400;
    color: var(--color-text-input);
    padding-left: 10px;
    
  }
}
</style>