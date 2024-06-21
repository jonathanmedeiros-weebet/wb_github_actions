<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        :fill="color"
        :width="size"
        :height="size"
    >
        <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
    </svg>
</template>

<script>
export default {
    name: 'icon-arrow-left',
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