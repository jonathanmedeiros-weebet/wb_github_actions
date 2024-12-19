<template>
    <div class="lottery">
      
    </div>
</template>

<script>

export default {
    name: 'lottery-modality',
    components: { 
    },
    data() {
        return {
            title: 'Loteria Popular',
        }
    },
    activated() {
        this.loadPage();
    },
    methods: {
        loadPage() {
        },
    }
}
</script>

<style lang="scss" scoped>
.lottery {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
}
</style>
