import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import ProcessTimeline from '../../components/ProcessTimeline';
import { STEPS } from '../../constants';

describe('ProcessTimeline', () => {
  it('renders all step titles', () => {
    render(<ProcessTimeline />);
    for (const step of STEPS) {
      expect(screen.getByText(step.title)).toBeInTheDocument();
    }
  });

  it('renders step numbers for inactive steps', () => {
    render(<ProcessTimeline />);
    // Steps 02, 03, 04 start as inactive so their number labels are visible
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('shows description for the active step on click', () => {
    render(<ProcessTimeline />);
    // The first step is active by default — its description should be present
    expect(screen.getByText(STEPS[0].description)).toBeInTheDocument();
  });

  it('shows description of clicked step', () => {
    render(<ProcessTimeline />);
    const secondStep = STEPS[1];
    // Click the second step card to activate it
    fireEvent.click(screen.getByText(secondStep.title));
    expect(screen.getByText(secondStep.description)).toBeInTheDocument();
  });

  it('shows correct number of step nodes', () => {
    const { container } = render(<ProcessTimeline />);
    // Each step renders a clickable div — verify STEPS.length items exist
    const stepDivs = container.querySelectorAll('.group.cursor-pointer');
    expect(stepDivs.length).toBe(STEPS.length);
  });

  it('outer container has pl-4 to keep node marker off the left edge on mobile', () => {
    const { container } = render(<ProcessTimeline />);
    const wrapper = container.querySelector('.relative.max-w-4xl');
    expect(wrapper).not.toBeNull();
    expect(wrapper!.className).toMatch(/pl-4/);
  });

  it('vertical timeline line is anchored at left-[27px]', () => {
    const { container } = render(<ProcessTimeline />);
    // The gradient vertical line element
    const line = container.querySelector('.absolute.top-4.bottom-4');
    expect(line).not.toBeNull();
    expect(line!.className).toMatch(/left-\[27px\]/);
  });

  it('active step card has bg-surface class', () => {
    const { container } = render(<ProcessTimeline />);
    // First step is active by default — its content card should show bg-surface
    const activeCard = container.querySelector('.bg-surface.border-cyan-500\\/30');
    expect(activeCard).not.toBeNull();
  });
});
