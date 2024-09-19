<template>
    <button class="live-button" :class="{'live-button--actived': actived}">
        <IconCircle class="live-button__icon" :size="12" :color="actived ? '#ffffff' : '#f61a1a'" />
        <span>Ao vivo</span>
    </button>
</template>

<script>
import IconCircle from '@/components/icons/IconCircle.vue'
export default {
  components: { IconCircle },
    name: 'live-button',
    props: {
        actived: {
            type: Boolean,
            required: false
        },
    },
}
</script>

<style lang="scss" scoped>
.live-button {
    height: 21px;
    padding: 0 4px;

    display: flex;
    justify-content: center;
    align-items: center;
    gap: 4px;

    border: 0;
    border-radius: 3px;
    background: #ffffff;
    background: var(--foreground-league);

    color: #f61a1a;
    color: var(--color-danger);

    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;

    &--actived {
        background: #f61a1a;
        background: var(--color-danger);
        color: #ffffff;
        color: var(--foreground-league);
    }

    &--actived &__icon {
        animation: blink 1s linear infinite;
    }
}
</style>