<template>
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 -960 960 960" 
        :fill="color"
        :height="size" 
        :width="size" 
    >
        <path d="M200-440v-80h560v80H200Z"/>
    </svg>

</template>
<script>
export default {
    name: 'icon-remove',
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
