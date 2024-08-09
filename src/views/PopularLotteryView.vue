<template>
    <div class="lottery">
        <Header :title="title" :showBackButton="true" />
        <div class="lottery__container">
            <iframe
                :src="gameUrl"
                width="auto"
                frameborder="0"
                allowfullscreen
            ></iframe>
        </div>
    </div>
</template>

<script>
import Header from '@/components/layouts/Header.vue';

export default {
    name: 'popular-lottery',
    components: { Header },
    data() {
        return {
            title: 'Loteria Popular',
            gameUrl: 'https://www.youtube.com/embed/q7Aqkbg0DzI',
        }
    }

}
</script>

<style lang="scss" scoped>
.lottery {
    
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
   
    &__container {
        padding: 8px 16px;
    }

 
}
</style>