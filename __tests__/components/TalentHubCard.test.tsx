import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TalentHubCard from '../../components/TalentHubCard';
import type { TalentHub } from '../../types';

const mockHub: TalentHub = {
  id: 'test-hub',
  country: 'Test Country',
  flag: '🏳️',
  flagCode: 'xx',
  specialty: 'Test Specialty',
  description: 'A description of the test hub.',
  infrastructure: 'Excellent infrastructure.',
  communication: 'Clear communication.',
  gradient: 'from-cyan-500/20 to-blue-500/20',
  keyCities: ['City A', 'City B'],
  educationFocus: 'Computer Science',
  timeZoneAlignment: 'GMT+0',
  popularTech: ['React', 'Node.js'],
};

describe('TalentHubCard', () => {
  it('renders the country name', () => {
    render(<TalentHubCard hub={mockHub} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('Test Country')).toBeInTheDocument();
  });

  it('renders the flag image using flagCode', () => {
    render(<TalentHubCard hub={mockHub} index={0} onClick={vi.fn()} />);
    const flagImg = screen.getByAltText('Test Country') as HTMLImageElement;
    expect(flagImg).toBeInTheDocument();
    expect(flagImg.src).toContain('flagcdn.com/w80/xx.png');
  });

  it('renders the specialty', () => {
    render(<TalentHubCard hub={mockHub} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('Test Specialty')).toBeInTheDocument();
  });

  it('renders the description', () => {
    render(<TalentHubCard hub={mockHub} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('A description of the test hub.')).toBeInTheDocument();
  });

  it('calls onClick with the hub when clicked', () => {
    const onClick = vi.fn();
    render(<TalentHubCard hub={mockHub} index={0} onClick={onClick} />);
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith(mockHub);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders an "Explore" action hint', () => {
    render(<TalentHubCard hub={mockHub} index={0} onClick={vi.fn()} />);
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });
});
