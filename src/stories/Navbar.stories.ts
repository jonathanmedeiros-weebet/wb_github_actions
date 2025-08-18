import Navbar from "@/components/Navbar/Navbar.vue";
import type { Meta, StoryObj } from "@storybook/vue3-vite";

const meta = {
  title: "Example/Navbar",
  component: Navbar,
  tags: ["autodocs"],
} satisfies Meta<typeof Navbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};