<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :fill="color"
        :width="size"
        :height="size"
    >
        <path d="M12 8L18 14H6L12 8Z"></path>
    </svg>
</template>

<script>
export default {
    name: 'icon-arrow-fill-up',
    props: {
        size: {
            type: Number,
            default: 20
        },
        color: {
            type: String,
            default: '#ffffff'
        }
    }
}
</script>