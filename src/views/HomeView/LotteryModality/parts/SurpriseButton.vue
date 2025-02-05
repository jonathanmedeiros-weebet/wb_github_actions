<template>
    <button
        @click="handleClick"
        :style="{ backgroundColor: buttonBackgroundColor, color: buttonColor}"
    >
        <IconSurprise :color="buttonColor"/>
        Surpresinha
    </button>
</template>
  
<script>
import IconSurprise from '@/components/icons/IconSurprise.vue';
import { isAndroid5 } from '@/utilities';
export default {
    components: { IconSurprise },
    name: 'w-surprise-button',
    computed: {
        buttonColor() {
            return isAndroid5() ? '#181818' : 'var(--highlight-foreground)';
        },
        buttonBackgroundColor() {
            return isAndroid5() ? '#0BE58E' : 'var(--highlight)';
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
button {
    border: none;
    margin: 0;
    width: auto;
    overflow: visible;
    line-height: normal;
    -webkit-font-smoothing: inherit;
    -moz-osx-font-smoothing: inherit;
    -webkit-appearance: none;

    display: flex;
    height: 40px;
    padding: 12px;
    justify-content: center;
    align-items: center;
    gap: 8px;
    border-radius: 100px;
    box-shadow: 0px 2px 10.2px 0px rgba(255, 255, 255, 0.30);
}
</style>
  