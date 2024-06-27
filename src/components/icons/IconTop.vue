<template>
    <svg 
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960" 
        :fill="color"
        :width="size"
        :height="size"
    >
        <path d="M480-528 296-344l-56-56 240-240 240 240-56 56-184-184Z"/>
    </svg>
        
</template>
<script>
export default {
    name: 'icon-top',
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