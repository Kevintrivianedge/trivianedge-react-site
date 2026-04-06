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
});
