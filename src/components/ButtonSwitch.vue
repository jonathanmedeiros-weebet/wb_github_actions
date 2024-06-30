<template>
  <label class="toggle">
    <input
      :id="id"
      :name="name" 
      class="toggle__checkbox" 
      type="checkbox"
      v-model="isChecked"
    >
    <div class="toggle__switch"></div>
  </label>
</template>

<script>
export default {
  name: 'button-switch',
  props: {
    id: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    value: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isChecked: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.toggle {
  cursor: pointer;
  display: inline-block;

  &__switch {
    display: inline-block;
    background: #ccc;
    border-radius: 16px;
    width: 39px;
    height: 20px;
    position: relative;
    vertical-align: middle;
    transition: background 0.25s;
  }

  &__switch:before, &__switch:after {
    content: "";
  }

  &__switch:before {
    display: block;
    background: linear-gradient(to bottom, #fff 0%, #eee 100%);
    border-radius: 50%;
    width: 14px;
    height: 14px;
    position: absolute;
    top: 3px;
    left: 3px;
    transition: left 0.25s;
  }

  &__checkbox:checked + &__switch {
    background: rgba(109, 165, 68, 1);
  }

  &__checkbox:checked + &__switch:before {
    left: 22px;
  }

  &__checkbox {
    position: absolute;
    visibility: hidden;
  }

  &:hover &__switch:before {
    background: linear-gradient(to bottom, #fff 0%, #fff 100%);
  }
}
</style>