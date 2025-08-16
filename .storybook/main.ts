import type { StorybookConfig } from '@storybook/vue3-vite';

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.mdx",
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-docs",
    '@storybook/addon-styling-webpack',
    '@storybook/addon-themes' // se quiser trocar temas
  ],
  "framework": {
    "name": "@storybook/vue3-vite",
    "options": {}
  }
};
export default config;