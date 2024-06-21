<template>
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24" 
        :fill="color"
        :width="size"
        :height="size"
    >
        <path d="M3 4H21V6H3V4ZM3 11H21V13H3V11ZM3 18H21V20H3V18Z"></path>
    </svg>
</template>

<script>
export default {
    name: 'icon-menu',
    props: {
        size: {
            type: Number,
            default: 20
        },
        color: {
            type: String,
            default: '#000000'
        }
    }
}
</script>