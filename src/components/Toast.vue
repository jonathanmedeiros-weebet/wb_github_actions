<template>
    <div class="toast" :class="`toast--${type}`">
        <div class="toast__container">
            <slot />
        </div>
        <div class="toast__close_icon" @click="handleClick">
            <icon-close ></icon-close>
        </div>
    </div>
</template>

<script>
import IconClose from './icons/IconClose.vue'
export default {
  components: { IconClose },
    name: 'toast',
    props: {
        type: {
            type: String,
            default: 'success'
        },
        timeout: {
            type: Number,
            default: 3000
        }
    },
    methods: {
        handleClick() {
            this.$emit('close');
        }
    },
    mounted() {
        setTimeout(() => {
            this.$emit('close');
        }, this.timeout);
    }
}
</script>

<style lang="scss" scoped>
.toast {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 15px;
    border-radius: 8px;

    position: absolute;
    width: 90%;
    left: 5%;
    top: 2%;
    
    &--success {
        background-color: var(--color-success);
    }

    &--warning {
        background-color: var(--color-warning);
    }

    &--danger {
        background-color: var(--color-danger);
    }

    &__close_icon {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
    }  
}
</style>