import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import WorldMapSVG from '../../components/WorldMapSVG';
import { TALENT_HUBS } from '../../constants';

describe('WorldMapSVG', () => {
  it('renders without crashing', () => {
    const { container } = render(<WorldMapSVG hubs={TALENT_HUBS} />);
    expect(container.firstChild).not.toBeNull();
  });

  it('renders one interactive button per hub', () => {
    render(<WorldMapSVG hubs={TALENT_HUBS} />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBe(TALENT_HUBS.length);
  });

  it('each hub button has a descriptive aria-label', () => {
    render(<WorldMapSVG hubs={TALENT_HUBS} />);
    for (const hub of TALENT_HUBS) {
      const btn = screen.getByLabelText(new RegExp(hub.country, 'i'));
      expect(btn).toBeInTheDocument();
    }
  });

  it('shows tooltip on mouseEnter and hides on mouseLeave', () => {
    render(<WorldMapSVG hubs={TALENT_HUBS} />);
    const firstHub = TALENT_HUBS[0];
    const btn = screen.getByLabelText(new RegExp(firstHub.country, 'i'));

    // Tooltip should not be visible initially
    expect(screen.queryByText(firstHub.specialty)).toBeNull();

    fireEvent.mouseEnter(btn);
    // After hover the tooltip with the specialty text should appear
    expect(screen.getByText(firstHub.specialty)).toBeInTheDocument();

    fireEvent.mouseLeave(btn);
    expect(screen.queryByText(firstHub.specialty)).toBeNull();
  });

  it('map img does not have the invert class (would make it invisible on white background)', () => {
    const { container } = render(<WorldMapSVG hubs={TALENT_HUBS} />);
    const mapImg = container.querySelector('img[alt*="world map"]');
    expect(mapImg).not.toBeNull();
    expect(mapImg!.className).not.toMatch(/\binvert\b/);
  });

  it('tooltip has an overflow-safe max-width (max-w-[min(220px,75vw)])', () => {
    render(<WorldMapSVG hubs={TALENT_HUBS} />);
    const firstHub = TALENT_HUBS[0];
    const btn = screen.getByLabelText(new RegExp(firstHub.country, 'i'));
    fireEvent.mouseEnter(btn);

    // Find the tooltip container
    const tooltip = screen.getByText(firstHub.specialty).closest('div[class*="absolute"]');
    expect(tooltip).not.toBeNull();
    // Must contain a viewport-bounded max-width to prevent overflow on narrow screens
    expect(tooltip!.className).toMatch(/max-w-\[min\(220px/);
  });

  it('calls onHubClick when a hub button is clicked', () => {
    const onHubClick = vi.fn();
    render(<WorldMapSVG hubs={TALENT_HUBS} onHubClick={onHubClick} />);
    const firstHub = TALENT_HUBS[0];
    const btn = screen.getByLabelText(new RegExp(firstHub.country, 'i'));
    fireEvent.click(btn);
    expect(onHubClick).toHaveBeenCalledWith(firstHub);
  });
});
