import type { Preview } from '@storybook/vue3'
import { tenantConfigs } from '../src/composables/useTenantConfig/tenantMockup.constant';
import { setTenantConfig } from '../src/composables/useTenantConfig';
import "../src/assets/styles/index.scss";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
  decorators: [
    (story, context) => {
      const tenantConfig = tenantConfigs[context.globals.tenant];

      // Remove CSS antigo do tenant
      const oldStyle = document.getElementById('tenant-colors');
      if (oldStyle) oldStyle.remove();

      // Cria nova tag style com o CSS do tenant
      const style = document.createElement('link');
      style.id = 'tenant-colors';
      style.rel = 'stylesheet';
      style.href = `/src/assets/styles/${tenantConfig.slug}/_colors.scss`;
      document.head.appendChild(style);

      setTenantConfig(tenantConfig);

      return {
        setup() {
          return { args: context.args };
        },
        components: { story },
        template: `<story v-bind="args" />`,
      };
    },
  ],
  globalTypes: {
    tenant: {
      name: "Tema",
      description: "Selecione o tema para visualizar os componentes",
      defaultValue: "naipe",
      toolbar: {
        icon: "globe",
        items: [
          { value: "naipe", title: "Naípe" },
          { value: "weebet", title: "Weebet" },
        ],
      },
    },
  }
};

export default preview;