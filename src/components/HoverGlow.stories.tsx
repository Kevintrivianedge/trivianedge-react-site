import type { Meta, StoryObj } from '@storybook/react';
import { HoverGlow } from './HoverGlow';

const meta = {
  title: 'Animation/HoverGlow',
  component: HoverGlow,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    scale: {
      control: { type: 'number', min: 1, max: 1.2, step: 0.01 },
      description: 'Scale factor on hover',
    },
    glowColor: {
      control: 'color',
      description: 'Glow color (CSS color value)',
    },
    duration: {
      control: { type: 'number', min: 0.1, max: 1, step: 0.1 },
      description: 'Animation duration in seconds',
    },
  },
} satisfies Meta<typeof HoverGlow>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    scale: 1.05,
    glowColor: 'rgba(77, 188, 159, 0.3)',
    duration: 0.2,
    children: (
      <button className="px-6 py-3 bg-teal-500 text-white rounded-lg font-semibold hover:cursor-pointer">
        Hover Me
      </button>
    ),
  },
};

export const StrongGlow: Story = {
  args: {
    scale: 1.08,
    glowColor: 'rgba(0, 255, 224, 0.5)',
    duration: 0.3,
    children: (
      <button className="px-8 py-4 bg-cyan-500 text-white rounded-lg font-semibold text-lg hover:cursor-pointer">
        Strong Glow
      </button>
    ),
  },
};

export const SubtleGlow: Story = {
  args: {
    scale: 1.02,
    glowColor: 'rgba(77, 188, 159, 0.15)',
    duration: 0.15,
    children: (
      <button className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:cursor-pointer">
        Subtle Glow
      </button>
    ),
  },
};

export const CardWithGlow: Story = {
  args: {
    scale: 1.05,
    glowColor: 'rgba(77, 188, 159, 0.4)',
    duration: 0.2,
    children: (
      <div className="w-64 p-6 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl">
        <h3 className="text-white font-bold text-xl mb-2">Interactive Card</h3>
        <p className="text-gray-300 text-sm">Hover to see the glow effect on this card</p>
      </div>
    ),
  },
};

export const PurpleGlow: Story = {
  args: {
    scale: 1.06,
    glowColor: 'rgba(168, 85, 247, 0.4)',
    duration: 0.25,
    children: (
      <button className="px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:cursor-pointer">
        Purple Glow
      </button>
    ),
  },
};
