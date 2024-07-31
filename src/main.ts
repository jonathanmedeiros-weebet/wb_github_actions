import './assets/main.scss'

import Vue from 'vue'
import { PiniaVuePlugin, createPinia } from 'pinia'
import VueRouter from 'vue-router'
import VueMask from 'vue-the-mask'

import App from './App.vue'
import router from './router'
import { useConfigClient } from './stores'

Vue.use(VueMask);
Vue.use(PiniaVuePlugin)
Vue.use(VueRouter)
declare var WeebetMessage: any;

new Vue({
    beforeCreate() {
        WeebetMessage.addEventListener('message', function(event: any) {
            const { setPrinterSetting } = useConfigClient();
            switch (event.data.action) {
                case 'printerWidth':
                    setPrinterSetting({ printerWidth: event.data.width })
                    break;
                case 'printGraphics':
                    setPrinterSetting({ printGraphics: event.data.print_graphics })
                    break;
                case 'apkVersion':
                    setPrinterSetting({ apkVersion: event.data.version })
                    break;
                default:
            }
        });
    },
    router,
    pinia: createPinia(),
    render: (h) => h(App)
}).$mount('#app')
