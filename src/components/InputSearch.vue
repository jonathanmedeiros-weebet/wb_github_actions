<template>
  <div class="input-search" :class="{ 'input-search--focused': isFocused }">
    <IconSearch :size="24" />
    <input
      class="input-search__field"
      type="text"
      :placeholder="placeholder"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
    />
    <div class="input-search__icon--right">
      <IconClose :size="14" @click.native="handleClear"/>
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
    };
  },
  methods: {
    handleInput(event) {
      this.$emit('input', event.target.value)
    },
    handleClear() {
      this.$emit('clear', '')
    },
    handleFocus(){
      this.isFocused = true;
    },
    handleBlur(){
      this.isFocused = false;
    },
  },
}
</script>

<style lang="scss" scoped>

.input-search {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;

  background-color: var(--color-background-input);
  border: 2px solid var(--color-background-input);

  box-sizing: border-box;
  border-radius: 50px;
  padding: 0 16px;
  width: 100%;
  
  &--focused {
    border-color: var(--color-primary);
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
    }
  }

  &__field {
    width: 100%;
    height: 40px;
    font-size: 16px;
    font-weight: 400;
    color: var(--color-text-input);
    background: transparent;
    border: 0;
    outline: none;
  }
  &__field:hover {
    background: transparent;
    border: 0;
  }
}
</style>