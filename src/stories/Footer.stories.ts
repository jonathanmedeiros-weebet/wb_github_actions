import type { Meta, StoryObj } from '@storybook/vue3-vite';
import Footer from '../components/Footer/Footer.vue';
import { tenantConfigs } from '@/composables/useTenantConfig/tenantMockup.constant';

const meta = {
  title: 'Example/Footer',
  component: Footer,
  tags: ['autodocs'],
} satisfies Meta<typeof Footer>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};