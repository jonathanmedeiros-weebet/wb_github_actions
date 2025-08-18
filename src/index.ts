import type { App } from 'vue-demi'
import Button from '@/components/Button/Button.vue';
import Navbar from '@/components/Navbar/Navbar.vue';
import Footer from '@/components/Footer/Footer.vue';
import { setProvideTenantConfig, useTenantConfig} from '@/composables/useTenantConfig/useTenantConfig';

export default {
  install(app: App) {
    app.component('WButtom', Button);
    app.component('WNavbar', Navbar);
    app.component('WFooter', Footer);
  }
};

export { setProvideTenantConfig, useTenantConfig }
