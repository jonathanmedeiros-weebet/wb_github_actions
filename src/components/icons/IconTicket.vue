<template>
    <div class="icon" style="position: relative; display: inline-block;">
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            :fill="color"
            :width="size"
            :height="size"
        >
            <path d="M9 4L6 2L3 4V19C3 20.6569 4.34315 22 6 22H20C21.6569 22 23 20.6569 23 19V16H21V4L18 2L15 4L12 2L9 4ZM19 16H7V19C7 19.5523 6.55228 20 6 20C5.44772 20 5 19.5523 5 19V5.07037L6 4.4037L9 6.4037L12 4.4037L15 6.4037L18 4.4037L19 5.07037V16ZM20 20H8.82929C8.93985 19.6872 9 19.3506 9 19V18H21V19C21 19.5523 20.5523 20 20 20Z"></path>
        </svg>
        <span v-if="count > 0" class="icon__badge">{{ count }}</span>
    </div>
</template>

<script>
export default {
    name: 'icon-ticket',
    props: {
        size: {
            type: Number,
            default: 20
        },
        color: {
            type: String,
            default: '#ffffff'
        },
        count: {
            type: Number,
            default: 0
        }
    }
}
</script>

<style lang="scss" scoped>
.icon {

    &__badge {
        position: absolute;
        top: -5px;
        right: -5px;
        background-color: #35cd96;
        background-color: var(--highlight);
        color: #181818;
        padding: 2px 6px;
        border-radius: 50%;
        font-size: 12px;
        line-height: 1;
    }
}
</style>
