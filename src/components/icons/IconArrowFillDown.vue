<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :fill="color"
        :width="size"
        :height="size"
    >
        <path d="M12 16L6 10H18L12 16Z"></path>
    </svg>
</template>

<script>
export default {
    name: 'icon-arrow-fill-down',
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