import type { Meta, StoryObj } from '@storybook/react';
import { RevealBlock } from './RevealBlock';

const meta = {
  title: 'Animation/RevealBlock',
  component: RevealBlock,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    direction: {
      control: 'select',
      options: ['up', 'left', 'right'],
      description: 'Direction of slide animation',
    },
    delay: {
      control: { type: 'number', min: 0, max: 2, step: 0.1 },
      description: 'Animation delay in seconds',
    },
    duration: {
      control: { type: 'number', min: 0.2, max: 2, step: 0.1 },
      description: 'Animation duration in seconds',
    },
  },
} satisfies Meta<typeof RevealBlock>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SlideUp: Story = {
  args: {
    direction: 'up',
    delay: 0.2,
    duration: 0.7,
    children: (
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Slide Up Animation</h2>
        <p className="text-white/80">This content slides up with fade-in effect</p>
      </div>
    ),
  },
};

export const SlideLeft: Story = {
  args: {
    direction: 'left',
    delay: 0.1,
    duration: 0.8,
    children: (
      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Slide Left Animation</h2>
        <p className="text-white/80">This content slides from the left</p>
      </div>
    ),
  },
};

export const SlideRight: Story = {
  args: {
    direction: 'right',
    delay: 0.3,
    duration: 0.6,
    children: (
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Slide Right Animation</h2>
        <p className="text-white/80">This content slides from the right</p>
      </div>
    ),
  },
};

export const QuickAnimation: Story = {
  args: {
    direction: 'up',
    delay: 0,
    duration: 0.3,
    children: (
      <div className="bg-blue-500 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white">Quick Animation</h2>
      </div>
    ),
  },
};

export const SlowAnimation: Story = {
  args: {
    direction: 'up',
    delay: 0.5,
    duration: 1.2,
    children: (
      <div className="bg-green-500 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-white">Slow Animation</h2>
        <p className="text-white/80">This has a longer, more deliberate reveal</p>
      </div>
    ),
  },
};
