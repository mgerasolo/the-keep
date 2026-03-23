/**
 * Spinner Component Tests
 * Tests for Story 0-9: Empty States & Loading Skeletons
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Spinner, PageSpinner, LoadingIndicator, ButtonSpinner } from '@/components/ui/spinner';

describe('Spinner Components', () => {
  describe('Spinner', () => {
    it('should render with role status', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('should have default aria-label', () => {
      render(<Spinner />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
    });

    it('should accept custom label', () => {
      render(<Spinner label="Saving changes" />);
      expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Saving changes');
    });

    it('should render different sizes', () => {
      const { rerender, container } = render(<Spinner size="sm" />);
      expect(container.querySelector('.h-4')).toBeInTheDocument();

      rerender(<Spinner size="lg" />);
      expect(container.querySelector('.h-8')).toBeInTheDocument();
    });

    it('should have animate-spin class', () => {
      const { container } = render(<Spinner />);
      expect(container.querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('PageSpinner', () => {
    it('should render with default label', () => {
      render(<PageSpinner />);
      // Text appears both in visible paragraph and sr-only span
      expect(screen.getAllByText('Loading...')).toHaveLength(2);
    });

    it('should render with custom label', () => {
      render(<PageSpinner label="Fetching data..." />);
      // Text appears both in visible paragraph and sr-only span
      expect(screen.getAllByText('Fetching data...')).toHaveLength(2);
    });

    it('should be centered', () => {
      const { container } = render(<PageSpinner />);
      expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('LoadingIndicator', () => {
    it('should render with default text', () => {
      render(<LoadingIndicator />);
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should render with custom text', () => {
      render(<LoadingIndicator text="Processing..." />);
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    it('should include spinner', () => {
      render(<LoadingIndicator />);
      expect(screen.getByRole('status')).toBeInTheDocument();
    });
  });

  describe('ButtonSpinner', () => {
    it('should render small spinner', () => {
      const { container } = render(<ButtonSpinner />);
      expect(container.querySelector('.h-4')).toBeInTheDocument();
    });

    it('should have margin-right', () => {
      const { container } = render(<ButtonSpinner />);
      expect(container.firstChild).toHaveClass('mr-2');
    });
  });
});
