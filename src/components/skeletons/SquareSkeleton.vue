<template>
    <div class="square-skeleton" :style="{width: widthContext, height: `${height}px`}"></div>
</template>

<script>
export default {
    name: "square-skeleton",
    props: {
        height: {
            type: Number,
            default: 10
        },
        width: {
            type: Number | String,
            default: 10
        },
    },
    computed: {
        widthContext() {
            return this.width == 'full' ? '100%' : `${this.width}px`
        }
    }
}
</script>

<style>
.square-skeleton {
    border-radius: 5px;
    background: rgba(130, 130, 130, 0.2);
    background: -webkit-gradient(linear, left top, right top, color-stop(8%, rgba(130, 130, 130, 0.2)), color-stop(18%, rgba(130, 130, 130, 0.3)), color-stop(33%, rgba(130, 130, 130, 0.2)));
    background: linear-gradient(to right, rgba(130, 130, 130, 0.2) 8%, rgba(130, 130, 130, 0.3) 18%, rgba(130, 130, 130, 0.2) 33%);
    background-size: 800px 100px;
    animation: wave-squares 2s infinite ease-out;
}

@keyframes wave-squares {
    0% {
        background-position: -468px 0;
    }
     100% {
        background-position: 468px 0;
    }
}
</style>