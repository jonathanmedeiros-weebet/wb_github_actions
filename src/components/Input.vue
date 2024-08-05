<template>
  <div class="input">
    <label class="input__label" v-if="label" :for="name">{{ label }}</label>
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
        :type="inputType"
        @focus="handleFocus"
        @blur="handleBlur"
        v-if="canMask && mask"
        v-mask="mask"
        :maxlength="maxlength"
        @click="$emit('click')"
        @change="emitChange"
        :value="value"
        autocomplete="off"
        :readonly="readonly"
      />
      <input
        v-else
        :id="name"
        :name="name"
        :placeholder="placeholder"
        @input="handleInput"
        class="input__field"
        :type="inputType"
        @focus="handleFocus"
        @blur="handleBlur"
        :value="value"
        :maxlength="maxlength"
        @click="$emit('click')"
        @change="emitChange"
        autocomplete="off"
        @keypress="emitKeypress"
        :readonly="readonly"
      />
      <div class="input__icon__right" v-if="initType == 'password'" @click="passWordVisible">
        <icon-visibility v-if="showPassword" color="var(--color-text-input)" />
        <icon-visibility-off v-else color="var(--color-text-input)" />
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
      required: false
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: String | Number,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    placeholder: {
      type: String,
      default: ''
    },
    mask: {
      type: String,
      default: ''
    },
    maxlength: {
      type: String,
      default: '255'
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFocused: false,
      showPassword: false,
      initType: this.type,
      inputType: this.type
    };
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value)
    },
    handleFocus(){
      this.isFocused = true;
      this.$emit('focus');
    },
    handleBlur(){
      this.isFocused = false;
    },
    passWordVisible() {
      this.showPassword = !this.showPassword;
      this.inputType = this.showPassword ? 'text' : 'password';
    },
    emitChange(event) {
      this.$emit('change',  event.target.value);
    },
    reset() {
      this.value = '';
    },
    emitKeypress(event) {
      this.$emit('keypress', event);
    }
  },
  computed: {
    password() {
      return this.value;
    },
    canMask() {
      return !['email', 'number', 'date', 'password'].includes(this.initType);
    }
  }
}
</script>

<style lang="scss" scoped>

input {
  background-color: #181818;
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
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;

  &__label {
    font-weight: 400;
    font-size: 16px;
    color: #ffffff;
    color: var(--color-text);
  }

  &__group {
    display: flex;
    align-items: center;
    padding-left: 10px;
    background-color: #181818;
    background-color: var(--color-background-input);
    border-radius: 5px;
    border: 2px solid #181818;
    border: 2px solid var(--color-background-input);

    &--focused {
      border-color: var(--color-primary);
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
    color: #ffffff;
    color: var(--color-text-input);
    padding-left: 10px;
    background: transparent;
  }
}
</style>