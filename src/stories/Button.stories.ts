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
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    color: { control: 'select', options: ['primary', 'secondary', 'tertiary'] },
    variant: { control: 'select', options: ['solid', 'outlined', 'clear'] },
  },
  args: {
    label: 'Entrar',
    color: 'primary',
    size: 'md',
    onClick: fn(),
  } as ButtonProps,
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
    variant: 'solid',
    size: 'md',
  },
};

export const Solid: Story = {
  args: {
    color: 'primary',
    variant: 'solid',
    size: 'md',
  },
};

export const Outline: Story = {
  args: {
    color: 'primary',
    variant: 'outline',
    size: 'md',
  },
};

export const Clear: Story = {
  args: {
    color: 'primary',
    variant: 'clear',
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    label: 'Grande',
    size: 'lg',
  },
};

export const Medium: Story = {
  args: {
    label: 'Médio',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    label: 'Pequeno',
    size: 'sm',
  },
};
