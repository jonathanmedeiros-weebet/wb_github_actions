<template>
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        :width="size" 
        :height="size" 
        viewBox="0 0 24 24" 
        fill="none"
    >
        <g clip-path="url(#clip0_188_605)">
            <path 
                d="M18 4H6C4.9 4 4 4.9 4 6V18C4 19.1 4.9 20 6 20H18C19.1 20 20 19.1 20 18V6C20 4.9 19.1 4 18 4ZM18 18H6V6H18V18Z" 
                :fill="color" 
                fill-opacity="0.5"
            />
        </g>
        <defs>
            <clipPath id="clip0_188_605">
                <rect width="24" height="24" fill="white"/>
            </clipPath>
        </defs>
    </svg>
</template>

<script>
export default {
    name: 'icon-checkbox',
    props: {
        size: {
            type: Number,
            default: 24
        },
        color: {
            type: String,
            default: 'white'
        }
    }
}
</script>
