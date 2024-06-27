<template>
  <div class="button">
    <button
      :id="id"
      :value="value"
      type="button"
      :class="buttonClass"
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
        'button button--primary': this.color === 'primary',
        'button button--secondary': this.color === 'secondary'
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
  flex-direction: column;
  width: 100%;
  height: 46px;
  border-radius: 8px 8px 8px 8px;
  border: none;
  font-size: 14px;
  font-weight: 400;
  
  line-height: 16.41px;
  padding: 10px;
  background: var(--color-primary);
  
  &--primary {
    color: rgba(10, 10, 10, 1);
    background-color: rgb(3, 181, 110);
    
  }

  &--secondary {
    background: var(--color-primary);
    color: var(--color-text);
  }
 
}
</style>
