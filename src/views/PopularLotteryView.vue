<template>
    <div class="lottery">
        <Header :title="title" :showBackButton="true" />
        <div class="lottery__fullscreen" >
            <icon-fullscreen @click="toggleFullscreen"/>
        </div>
        <div class="lottery__container">
            <iframe
                ref="lotteryIframe"
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
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';
import { getGameUrlPopularLottery } from '@/services';
import { useConfigClient, useToastStore } from '@/stores';
import IconFullscreen from '@/components/icons/IconFullscreen.vue';

export default {
    name: 'popular-lottery',
    components: { 
        Header,
        Toast,
        IconFullscreen
    },
    data() {
        return {
            title: 'Loteria Popular',
            gameUrl: '',
            options: useConfigClient().options,
            toastStore: useToastStore(),
            isFullscreen: false
        }
    },
    mounted() {
        if(this.options.loteriaPopular){
            this.getGameUrl();
        }else{
            this.toastStore.setToastConfig({
                message: 'Você não tem acesso a Loteria Popular',
                type: ToastType.DANGER,
                duration: 3000
            })

            this.$router.push({ name: 'home' });
        }
    },
    methods: {
        async getGameUrl(){
            getGameUrlPopularLottery()
                .then(resp => {
                    console.log(resp);
                    this.gameUrl = resp.gameUrl;
                })
                .catch(error => {
                    console.error(error);
                    this.toastStore.setToastConfig({
                        message: error.errors?.message,
                        type: ToastType.DANGER,
                        duration: 3000
                    })
                })
        },
        toggleFullscreen() {
            const iframe = this.$refs.lotteryIframe;
            if (!this.isFullscreen) {
                if (iframe.requestFullscreen) {
                    iframe.requestFullscreen();
                } else if (iframe.mozRequestFullScreen) { // Firefox
                    iframe.mozRequestFullScreen();
                } else if (iframe.webkitRequestFullscreen) { // Chrome, Safari and Opera
                    iframe.webkitRequestFullscreen();
                } else if (iframe.msRequestFullscreen) { // IE/Edge
                    iframe.msRequestFullscreen();
                }
                this.isFullscreen = true;
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) { // Firefox
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) { // IE/Edge
                    document.msExitFullscreen();
                }
                this.isFullscreen = false;
            }
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

    &__fullscreen {
        display: flex;
        justify-content: end;
        padding: 3px 10px;
        height: 30x;
        width: 100%;
        background-color: rgba(51, 51, 51, 0.4);
        margin-bottom: 20px;
    }

    &__container {
        padding: 8px 1px;
    }

   
}
</style>
