import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
import { TalentHubModal } from '../../components/TalentHubModal';
import { TALENT_HUBS } from '../../constants';

const hub = TALENT_HUBS[0];

const renderModal = (onClose = vi.fn()) =>
  render(
    <MemoryRouter>
      <TalentHubModal hub={hub} onClose={onClose} />
    </MemoryRouter>,
  );

describe('TalentHubModal', () => {
  beforeEach(() => {
    // Reset body scroll locks between tests
    document.body.style.overflow = '';
    document.body.dataset.scrollLocks = '0';
  });

  it('renders the hub country name', () => {
    renderModal();
    expect(screen.getByText(hub.country)).toBeInTheDocument();
  });

  it('has role="dialog" and aria-modal="true"', () => {
    const { container } = renderModal();
    const dialog = container.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(dialog!.getAttribute('aria-modal')).toBe('true');
  });

  it('locks body scroll on mount', () => {
    renderModal();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores body scroll on unmount', () => {
    const { unmount } = renderModal();
    unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('calls onClose when Escape key is pressed', () => {
    const onClose = vi.fn();
    renderModal(onClose);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('close button has aria-label="Close modal"', () => {
    renderModal();
    const closeBtn = screen.getByLabelText('Close modal');
    expect(closeBtn).toBeInTheDocument();
  });

  it('modal inner container supports dynamic viewport height (h-[100dvh] on mobile)', () => {
    const { container } = renderModal();
    const dialog = container.querySelector('[role="dialog"]');
    // The scrollable inner div should have h-[100dvh] for iOS Safari dynamic viewport
    const inner = dialog!.querySelector('.h-\\[100dvh\\]');
    expect(inner).not.toBeNull();
  });
});
