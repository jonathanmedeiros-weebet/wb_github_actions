
import Button from '@/components/Button/Button.vue';
import Navbar from '@/components/Navbar/Navbar.vue';
import Footer from '@/components/Footer/Footer.vue';
import { setTenantConfig, useTenantConfig} from '@/composables/useTenantConfig';
import './assets/styles/index.scss';

const WNavbar = Navbar;
const WButton = Button;
const WFooter = Footer;

export default {
  install(app: any) {
    app.component('WButtom', Button);
    app.component('WNavbar', Button);
    app.component('WFooter', Footer);
  }
};

export {
  setTenantConfig,
  useTenantConfig,
  WNavbar,
  WButton,
  WFooter
}
