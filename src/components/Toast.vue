<template>
    <div
        v-show="showToast"
        class="toast"
        :class="`toast--${typeToast}`"
    >
        <div class="toast__container">
            {{ messageToast }}
        </div>
        <div class="toast__close_icon" @click="handleClick">
            <icon-close ></icon-close>
        </div>
    </div>
</template>

<script>
import { useToastStore } from '@/stores';
import IconClose from './icons/IconClose.vue'
export default {
  components: { IconClose },
    name: 'toast',
    data() {
        return {
            timeoutInstance: null,
            toastStore: useToastStore()
        }
    },
    updated() {
        if(this.showToast) {
            this.timeoutInstance = setTimeout(() => {
                this.toastStore.setToastConfig({message: ''})
            }, this.durationToast);
        }
    },
    computed: {
        showToast() {
            return Boolean(this.toastStore.message);
        },
        typeToast() {
            return this.toastStore.type;
        },
        messageToast() {
            return this.toastStore.message;
        },
        durationToast() {
            return this.toastStore.duration;
        }
    },
    methods: {
        handleClick() {
            if(this.timeoutInstance) {
                clearTimeout(this.timeoutInstance);
            }
            this.toastStore.setToastConfig({message: ''})
        }
    },
}
</script>

<style lang="scss" scoped>
.toast {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 15px;
    border-radius: 8px;

    position: fixed;
    width: 90%;
    left: 5%;
    top: 2%;

    z-index: 6;

    &--success {
        background-color: #6da544;
        background-color: var(--success);
    }

    &--alert {
        background-color: #c09516;
        background-color: var(--alert);
    }

    &--warning {
        background-color: #f61a1a;
        background-color: var(--warning);
    }

    &__close_icon {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: flex-start;
    }  
}
</style>