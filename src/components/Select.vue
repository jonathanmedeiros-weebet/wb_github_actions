<template>
  <div class="input">
    <label class="input__label" v-if="label" :for="name">{{ label }}</label>
    <div class="input__group">
      <div class="input__icon" v-if="$slots['icon']">
        <slot name="icon"></slot>
      </div>

      <div class="input__select-wrapper">
        <select
          :id="name"
          :name="name"
          @change="handleChange"
          v-model="selectedOptionObserve"
          class="input__field"
          :readonly="readonly"
        >
          <option
            v-for="(option, index) in options"
            :key="index"
            :value="option.value"
          >
            {{ option.text }}
          </option>
        </select>
        <div class="input__select-icon"></div> 
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'w-select',
  props: {
    label: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    options: {
      type: Array,
      required: true
    },
    readonly: {
      type: Boolean,
      default: false
    },
    selectedOption: {
      type: String | Number | null,
      default: ''
    }
  },
  computed: {
    selectedOptionObserve: {
      get() {
        return this.selectedOption;
      },
      set() {
        this.$emit('change', event.target.value);
      }
    }
  },
  methods: {
    handleChange(event) {
      this.$emit('change', event.target.value);
    },
  }
}
</script>

<style lang="scss" scoped>
.input {
  display: flex;
  flex-direction: column;
  margin-bottom: 8px;

  &__label {
    font-weight: 400;
    font-size: 16px;
    color: #ffffff;
    color: var(--foreground);
    margin-bottom: 8px;
  }

  &__group {
    display: flex;
    align-items: center;
    padding-left: 10px;
    background-color: #181818;
    background-color: var(--input);
    border-radius: 5px;
    border: 2px solid #181818;
    border: 0.5px solid var(--input-foreground);
    transition: 0.5s;
  }

  &__group--focused {
    border-color: #0be58e;
    border-color: var(--highlight);
  }

  &__icon {
    display: flex;
    align-items: center;
  }

  &__icon__right {
    display: flex;
    align-items: right;
    z-index: 1;
    padding-right: 10px;
  }

  &__select-wrapper {
    position: relative;
    width: 100%;
  }

  &__field {
    width: 100%;
    height: 56px;
    font-size: 14px;
    font-weight: 400;
    color: #ffffff;
    color: var(--input-foreground);
    padding-left: 10px;
    background: var(--input);
    border: none;
    border-radius: 5px;
    font-size: 14px;
    transition: 0.5s;
    outline: none;
    box-shadow: none;
  }

  &__select-icon {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--input-foreground);
    pointer-events: none; 
  }

  select {
    -webkit-appearance: none; 
    -moz-appearance: none;
    appearance: none;
  }

  select:focus {
    border-color: #0be58e;
    border-color: var(--highlight);
  }
}
</style>
