import type { App } from 'vue-demi'
import Buttom from './stories/Button.vue';

export default {
  install(app: App) {
    app.component('WButtom', Buttom);
  }
};