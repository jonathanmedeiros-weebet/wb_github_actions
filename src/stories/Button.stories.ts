import type { Meta, StoryObj } from '@storybook/vue3-vite';
import { fn } from 'storybook/test';

import Button from '@/components/Button/Button.vue';
import type { ButtonProps } from '@/components/Button/button.interface';
import { tenantConfigs } from '@/composables/useTenantConfig/tenantMockup.constant';

// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
const meta = {
  title: 'Example/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    backgroundColor: { control: 'color' },
  },
  args: {
    label: 'Entrar',
    primary: true,
    size: 'medium',
    onClick: fn(),
  } as ButtonProps,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    primary: true,
  },
};

export const Secondary: Story = {
  args: {
    primary: false,
  },
};

export const Large: Story = {
  args: {
    label: 'Grande',
    size: 'large',
  },
};

export const Medium: Story = {
  args: {
    label: 'Médio',
    size: 'medium',
  },
};

export const Small: Story = {
  args: {
    label: 'Pequeno',
    size: 'small',
  },
};
