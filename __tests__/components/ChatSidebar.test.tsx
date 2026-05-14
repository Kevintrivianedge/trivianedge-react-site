import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock @google/genai — not needed in unit tests
vi.mock('@google/genai', () => ({
  GoogleGenAI: vi.fn().mockImplementation(() => ({
    chats: { create: vi.fn() },
  })),
}));

// Mock GeoContext to avoid fetch side-effects
vi.mock('../../contexts/GeoContext', () => ({
  useGeo: () => ({ geoData: null }),
}));

import { ChatSidebar } from '../../components/ChatSidebar';

describe('ChatSidebar', () => {
  it('renders the trigger FAB button', () => {
    render(<ChatSidebar />);
    expect(screen.getByLabelText('Open AI Assistant')).toBeInTheDocument();
  });

  it('FAB is positioned with z-[150] (below navbar z-[100] is an error, so it must be >= 100)', () => {
    const { container } = render(<ChatSidebar />);
    const fab = container.querySelector('[aria-label="Open AI Assistant"]');
    expect(fab).not.toBeNull();
    // z-[150] keeps FAB above content but below modal overlays (z-[190]+)
    expect(fab!.className).toMatch(/z-\[150\]/);
  });

  it('FAB has enough padding for a 44px+ touch target', () => {
    const { container } = render(<ChatSidebar />);
    const fab = container.querySelector('[aria-label="Open AI Assistant"]');
    expect(fab).not.toBeNull();
    // p-4 = 16px × 2 sides + icon 24px = 56px total — meets WCAG 44px minimum
    expect(fab!.className).toMatch(/p-4/);
  });

  it('clicking the FAB opens the sidebar', () => {
    const { container } = render(<ChatSidebar />);
    const fab = screen.getByLabelText('Open AI Assistant');
    fireEvent.click(fab);
    // After opening, the close button should appear
    expect(screen.getByLabelText('Close AI Assistant')).toBeInTheDocument();
  });

  it('close button has min 44px touch target classes', () => {
    const { container } = render(<ChatSidebar />);
    fireEvent.click(screen.getByLabelText('Open AI Assistant'));
    const closeBtn = screen.getByLabelText('Close AI Assistant');
    expect(closeBtn.className).toMatch(/min-w-\[44px\]/);
    expect(closeBtn.className).toMatch(/min-h-\[44px\]/);
  });

  it('text input has fontSize 16px to prevent iOS auto-zoom', () => {
    render(<ChatSidebar />);
    fireEvent.click(screen.getByLabelText('Open AI Assistant'));
    const input = screen.getByPlaceholderText(/inquire/i) as HTMLInputElement;
    expect(input.style.fontSize).toBe('16px');
  });

  it('messages container has overscroll-none to prevent iOS pull-to-refresh hijack', () => {
    const { container } = render(<ChatSidebar />);
    fireEvent.click(screen.getByLabelText('Open AI Assistant'));
    // Find the scrollable messages area
    const messagesArea = container.querySelector('[aria-live="polite"]');
    expect(messagesArea).not.toBeNull();
    expect(messagesArea!.className).toMatch(/overscroll-none/);
  });
});
