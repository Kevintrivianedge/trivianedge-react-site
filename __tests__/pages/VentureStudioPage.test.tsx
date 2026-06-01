import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import VentureStudioPage from '../../pages/VentureStudioPage';

type FetchMock = ReturnType<typeof vi.fn>;

function buildFetchMock(overrides?: {
  ventureStatus?: number;
  ventureBody?: Record<string, unknown>;
}): FetchMock {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = String(input);

    if (url.includes('/api/venture/submit')) {
      const status = overrides?.ventureStatus ?? 200;
      const body = overrides?.ventureBody ?? {
        success: true,
        qualified: true,
        booking: {
          primaryProvider: 'calendly',
          primaryUrl: 'https://calendly.com/trivianedge/venture-studio-intro?name=John',
          fallbackProvider: 'google-calendar',
          fallbackUrl: 'https://calendar.google.com/calendar/u/0/r/eventedit?text=Call',
        },
        crm: {
          attempted: true,
          success: true,
          status: 200,
        },
      };

      return new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  });
}

async function fillAndAdvanceToReview() {
  fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Founder' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@startup.com' } });
  fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Startup Inc' } });
  fireEvent.change(screen.getByLabelText('Industry'), { target: { value: 'fintech' } });
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

  await waitFor(() => {
    expect(screen.getByText('Problem + Market')).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText('Idea Summary'), { target: { value: 'AI assistant for field teams' } });
  fireEvent.change(screen.getByLabelText('What problem are you solving?'), { target: { value: 'Manual reports are slow and error-prone.' } });
  fireEvent.change(screen.getByLabelText('Who are the first users?'), { target: { value: 'Operations managers' } });
  fireEvent.change(screen.getByLabelText('Business Model'), { target: { value: 'b2b' } });
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

  await waitFor(() => {
    expect(screen.getByText('Build Readiness')).toBeInTheDocument();
  });

  fireEvent.change(screen.getByLabelText('Readiness Level'), { target: { value: 'validated' } });
  fireEvent.change(screen.getByLabelText('Current Stage'), { target: { value: 'early-users' } });
  fireEvent.change(screen.getByLabelText('Target MVP Timeline'), { target: { value: 'under-4-weeks' } });
  fireEvent.change(screen.getByLabelText('AI Role In Product'), { target: { value: 'core-ai' } });
  fireEvent.change(screen.getByLabelText('Founder Commitment'), { target: { value: 'full-time' } });
  fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

  await waitFor(() => {
    expect(screen.getByText('Review + Submit')).toBeInTheDocument();
  });
}

describe('VentureStudioPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps user on step 1 when required founder fields are empty', () => {
    (globalThis as unknown as { fetch: FetchMock }).fetch = buildFetchMock();

    render(<HelmetProvider><MemoryRouter><VentureStudioPage /></MemoryRouter></HelmetProvider>);

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    expect(screen.getByText('Founder Profile')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 4')).toBeInTheDocument();
  });

  it('requires a typed custom industry when Other is selected', async () => {
    (globalThis as unknown as { fetch: FetchMock }).fetch = buildFetchMock();

    render(<HelmetProvider><MemoryRouter><VentureStudioPage /></MemoryRouter></HelmetProvider>);

    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Founder' } });
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'john@startup.com' } });
    fireEvent.change(screen.getByLabelText('Company'), { target: { value: 'Startup Inc' } });
    fireEvent.change(screen.getByLabelText('Industry'), { target: { value: 'other' } });

    expect(screen.getByLabelText('Your Industry')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(screen.getByText('Founder Profile')).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Your Industry'), { target: { value: 'Construction Tech' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));

    await waitFor(() => {
      expect(screen.getByText('Problem + Market')).toBeInTheDocument();
    });
  });

  it('submits successfully and shows booking actions in confirmation state', async () => {
    const fetchMock = buildFetchMock();
    (globalThis as unknown as { fetch: FetchMock }).fetch = fetchMock;

    render(<HelmetProvider><MemoryRouter><VentureStudioPage /></MemoryRouter></HelmetProvider>);
    await fillAndAdvanceToReview();

    fireEvent.click(screen.getByRole('button', { name: 'Submit Qualification' }));

    expect(await screen.findByText('Submission Received')).toBeInTheDocument();
    expect(screen.getByText('Your Venture Studio packet is confirmed.')).toBeInTheDocument();

    const bookLink = screen.getByRole('link', { name: /Book Via Calendly/i });
    expect(bookLink).toHaveAttribute('href', 'https://calendly.com/trivianedge/venture-studio-intro?name=John');

    expect(fetchMock).toHaveBeenCalledWith(
      '/api/venture/submit',
      expect.objectContaining({ method: 'POST' }),
    );
  });

  it('shows submit error when backend venture submit fails', async () => {
    const fetchMock = buildFetchMock({
      ventureStatus: 500,
      ventureBody: { success: false, error: 'Server unavailable' },
    });
    (globalThis as unknown as { fetch: FetchMock }).fetch = fetchMock;

    render(<HelmetProvider><MemoryRouter><VentureStudioPage /></MemoryRouter></HelmetProvider>);
    await fillAndAdvanceToReview();

    fireEvent.click(screen.getByRole('button', { name: 'Submit Qualification' }));

    expect(await screen.findByText('Server unavailable')).toBeInTheDocument();
  });
});
