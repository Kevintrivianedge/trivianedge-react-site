import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import BlogCard from '../../components/BlogCard';
import type { BlogPost } from '../../types';

const mockPost: BlogPost = {
  id: 'test-post',
  title: 'Test Blog Post',
  excerpt: 'This is a test excerpt for the blog post.',
  content: 'Full content here.',
  author: 'Test Author',
  date: 'Jan 1, 2025',
  readTime: '3 min read',
  category: 'Operations',
  imageGradient: 'from-cyan-500/20 to-blue-500/20',
  slug: 'test-post',
};

describe('BlogCard', () => {
  it('renders the post title', () => {
    const onClick = vi.fn();
    render(<BlogCard post={mockPost} onClick={onClick} index={0} />, { wrapper: MemoryRouter });
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument();
  });

  it('renders the category badge', () => {
    const onClick = vi.fn();
    render(<BlogCard post={mockPost} onClick={onClick} index={0} />, { wrapper: MemoryRouter });
    expect(screen.getByText('Operations')).toBeInTheDocument();
  });

  it('renders the author', () => {
    const onClick = vi.fn();
    render(<BlogCard post={mockPost} onClick={onClick} index={0} />, { wrapper: MemoryRouter });
    expect(screen.getByText('Test Author')).toBeInTheDocument();
  });

  it('renders the excerpt', () => {
    const onClick = vi.fn();
    render(<BlogCard post={mockPost} onClick={onClick} index={0} />, { wrapper: MemoryRouter });
    expect(screen.getByText('This is a test excerpt for the blog post.')).toBeInTheDocument();
  });

  it('calls onClick with the post id when clicked', () => {
    const onClick = vi.fn();
    render(<BlogCard post={mockPost} onClick={onClick} index={0} />, { wrapper: MemoryRouter });
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledWith('test-post');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders the read time', () => {
    const onClick = vi.fn();
    render(<BlogCard post={mockPost} onClick={onClick} index={0} />, { wrapper: MemoryRouter });
    expect(screen.getByText('3 min read')).toBeInTheDocument();
  });
});
