import './assets/main.scss'

import Vue from 'vue'
import { PiniaVuePlugin, createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueRouter from 'vue-router'
import { prepareConfigClient, checkToken } from '@/services'
import VueMask from 'vue-the-mask'

Vue.use(VueMask);
Vue.use(PiniaVuePlugin)
Vue.use(VueRouter)

new Vue({
    beforeCreate: () => {
        prepareConfigClient(),
        checkToken()
    },
    router,
    pinia: createPinia(),
    render: (h) => h(App)
}).$mount('#app')
