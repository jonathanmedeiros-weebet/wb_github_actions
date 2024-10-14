<template>
  <div class="input-search" :class="{ 'input-search--focused': isFocused }">
    <IconSearch :size="24" />
    <input
      class="input-search__field"
      type="text"
      :placeholder="placeholder"
      :value="inputValue"  
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      ref="myInput" 
    />
    <div class="input-search__icon--right">
      <IconClose :size="14" @click="handleClear"/>
    </div>
  </div>
</template>

<script>
import IconClose from './icons/IconClose.vue';
import IconSearch from './icons/IconSearch.vue';

export default {
  name: 'w-input-search',
  components: {
    IconSearch,
    IconClose
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Pesquisar'
    }
  },
  data() {
    return {
      isFocused: false,
      inputValue: this.value, 
    };
  },
  watch: {
    value(newValue) {
      this.inputValue = newValue;
    }
  },
  methods: {
    handleClear() {
      this.inputValue = '';  
      this.$emit('input', '');
      this.forcusInInput();
    },
    handleInput(event) {
      this.inputValue = event.target.value;  
      this.$emit('input', event.target.value);  
    },
    handleFocus() {
      this.isFocused = true;
    },
    handleBlur() {
      this.isFocused = false;
    },
    forcusInInput() {
      this.$refs.myInput.focus();
    },
  },
}
</script>

<style lang="scss" scoped>
.input-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #181818;
  background-color: var(--inputs-odds);
  border: 2px solid #181818;
  border: 2px solid var(--foreground-inputs-odds);

  box-sizing: border-box;
  border-radius: 50px;
  padding: 0 16px;
  width: 100%;
  
  &--focused {
    border-color: #0be58e;
    border-color: var(--highlight);
  }

  &__icon {
    &--right {
      background: #FFFFFF1A;
      border-radius: 50px;
      height: 16px;
      width: 16px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
    }
  }

  &__field {
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: 400;
    color: #ffffff80;
    color: var(--foreground-league-input);
    background: transparent;
    border: 0;
    outline: none;
    margin-left: 4px;
  }
  &__field:hover {
    background: transparent;
    border: 0;
  }
}
</style>
