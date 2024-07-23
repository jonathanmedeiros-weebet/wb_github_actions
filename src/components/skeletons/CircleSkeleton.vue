<template>
    <div class="circle" :style="{width: `${size}px`, height: `${size}px`}"></div>
</template>

<script>
export default {
    name: "circle-skeleton",
    props: {
        size: {
            type: Number,
            default: 10
        },
    }
}
</script>

<style>
.circle-skeleton {
    border-radius: 50%;
    background: rgba(130, 130, 130, 0.2);
    background: -webkit-gradient(linear, left top, right top, color-stop(8%, rgba(130, 130, 130, 0.2)), color-stop(18%, rgba(130, 130, 130, 0.3)), color-stop(33%, rgba(130, 130, 130, 0.2)));
    background: linear-gradient(to right, rgba(130, 130, 130, 0.2) 8%, rgba(130, 130, 130, 0.3) 18%, rgba(130, 130, 130, 0.2) 33%);
    background-size: 800px 100px;
    animation: wave-circle 2s infinite ease-out;
}

@keyframes wave-circle {
    0% {
        background-position: -468px 0;
    }
     100% {
        background-position: 468px 0;
    }
}
</style>