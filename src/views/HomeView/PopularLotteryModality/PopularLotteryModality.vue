<template>
    <div class="lottery">
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
import Toast from '@/components/Toast.vue';
import { ToastType } from '@/enums';
import { getGameUrlPopularLottery } from '@/services';
import { useConfigClient, useToastStore } from '@/stores';
import IconFullscreen from '@/components/icons/IconFullscreen.vue';

export default {
    name: 'popular-lottery-modality',
    components: { 
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
    activated() {
        this.loadPage();
    },
    beforeDestroy() {
        document.removeEventListener('fullscreenchange', this.onFullScreenChange);
    },
    methods: {
        loadPage() {
            if(this.options.loteriaPopular){
                this.getGameUrl();
                document.addEventListener('fullscreenchange', this.onFullScreenChange);
            }else{
                this.toastStore.setToastConfig({
                    message: 'Você não tem acesso a Loteria Popular',
                    type: ToastType.DANGER,
                    duration: 3000
                })

                this.$router.push({ name: 'home' });
            }
        },
        async getGameUrl(){
            getGameUrlPopularLottery()
                .then(resp => {
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
                if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    } else if (document.mozCancelFullScreen) { // Firefox
                        document.mozCancelFullScreen();
                    } else if (document.webkitExitFullscreen) { // Chrome, Safari and Opera
                        document.webkitExitFullscreen();
                    } else if (document.msExitFullscreen) { // IE/Edge
                        document.msExitFullscreen();
                    }
                }
                this.isFullscreen = false;
            }
        },
        onFullScreenChange() {
            this.isFullscreen = !!document.fullscreenElement;
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
        width: 100vw;
        height: calc(100vh -100px);
    }
}
</style>
