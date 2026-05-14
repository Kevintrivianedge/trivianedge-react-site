import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { LanguageProvider } from '../../contexts/LanguageContext';
import { ThemeProvider } from '../../contexts/ThemeContext';
import Navbar from '../../components/Navbar';

const renderNavbar = () =>
  render(
    <MemoryRouter>
      <ThemeProvider>
        <LanguageProvider>
          <Navbar />
        </LanguageProvider>
      </ThemeProvider>
    </MemoryRouter>
  );

describe('Navbar', () => {
  it('renders without crashing', () => {
    const { container } = renderNavbar();
    expect(container.querySelector('nav')).not.toBeNull();
  });

  it('hamburger button has minimum 44px touch target (min-w + min-h classes)', () => {
    const { container } = renderNavbar();
    // The hamburger is inside the .lg:hidden div — use aria-label added in implementation
    const hamburger = container.querySelector('[aria-label="Toggle navigation"]');
    expect(hamburger).not.toBeNull();
    expect(hamburger!.className).toMatch(/min-w-\[44px\]/);
    expect(hamburger!.className).toMatch(/min-h-\[44px\]/);
  });

  it('nav inner container has px-4 for small-screen breathing room', () => {
    const { container } = renderNavbar();
    const inner = container.querySelector('.max-w-7xl');
    expect(inner).not.toBeNull();
    expect(inner!.className).toMatch(/px-4/);
  });

  it('desktop nav links are hidden on mobile via hidden lg:flex', () => {
    const { container } = renderNavbar();
    const desktopNav = container.querySelector('.hidden.lg\\:flex');
    expect(desktopNav).not.toBeNull();
  });

  it('clicking hamburger mounts the full-screen mobile overlay', async () => {
    const { container } = renderNavbar();
    const hamburger = container.querySelector('[aria-label="Toggle navigation"]') as HTMLButtonElement;
    expect(hamburger).not.toBeNull();
    fireEvent.click(hamburger);
    // Framer Motion mounts the overlay immediately; AnimatePresence animates its entry
    await waitFor(() => {
      const overlay = container.querySelector('.fixed.inset-0.bg-background');
      expect(overlay).not.toBeNull();
    });
  });

  it('mobile menu includes a prominent CTA link ("Start here")', async () => {
    renderNavbar();
    const hamburger = screen.getByRole('button', { name: /toggle navigation/i });
    fireEvent.click(hamburger);
    await waitFor(() => {
      expect(screen.getByText('Start here')).toBeInTheDocument();
    });
  });
});
