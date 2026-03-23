/**
 * Skeleton Component Tests
 * Tests for Story 0-9: Empty States & Loading Skeletons
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import {
  Skeleton,
  SkeletonText,
  SkeletonAvatar,
  SkeletonCard,
  SkeletonList,
  SkeletonTable,
} from '@/components/ui/skeleton';

describe('Skeleton Components', () => {
  describe('Skeleton', () => {
    it('should render with default classes', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('animate-pulse');
      expect(skeleton).toHaveClass('rounded-md');
      expect(skeleton).toHaveClass('bg-surface-hover');
    });

    it('should accept custom className', () => {
      const { container } = render(<Skeleton className="h-10 w-full" />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveClass('h-10');
      expect(skeleton).toHaveClass('w-full');
    });

    it('should have aria-hidden for accessibility', () => {
      const { container } = render(<Skeleton />);
      const skeleton = container.firstChild as HTMLElement;
      expect(skeleton).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('SkeletonText', () => {
    it('should render single line by default', () => {
      const { container } = render(<SkeletonText />);
      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines).toHaveLength(1);
    });

    it('should render multiple lines', () => {
      const { container } = render(<SkeletonText lines={3} />);
      const lines = container.querySelectorAll('.animate-pulse');
      expect(lines).toHaveLength(3);
    });
  });

  describe('SkeletonAvatar', () => {
    it('should render with rounded-full class', () => {
      const { container } = render(<SkeletonAvatar />);
      const avatar = container.querySelector('.animate-pulse');
      expect(avatar).toHaveClass('rounded-full');
    });

    it('should render different sizes', () => {
      const { container: sm } = render(<SkeletonAvatar size="sm" />);
      const { container: lg } = render(<SkeletonAvatar size="lg" />);

      expect(sm.querySelector('.animate-pulse')).toHaveClass('h-8', 'w-8');
      expect(lg.querySelector('.animate-pulse')).toHaveClass('h-12', 'w-12');
    });
  });

  describe('SkeletonCard', () => {
    it('should render card structure', () => {
      const { container } = render(<SkeletonCard />);
      expect(container.querySelector('.border')).toBeInTheDocument();
      expect(container.querySelector('.rounded-full')).toBeInTheDocument();
    });
  });

  describe('SkeletonList', () => {
    it('should render 3 items by default', () => {
      const { container } = render(<SkeletonList />);
      const items = container.querySelectorAll('.flex.items-center.gap-3');
      expect(items).toHaveLength(3);
    });

    it('should render custom number of items', () => {
      const { container } = render(<SkeletonList items={5} />);
      const items = container.querySelectorAll('.flex.items-center.gap-3');
      expect(items).toHaveLength(5);
    });
  });

  describe('SkeletonTable', () => {
    it('should render header and rows', () => {
      const { container } = render(<SkeletonTable rows={3} columns={4} />);
      // Header row + 3 data rows
      const rows = container.querySelectorAll('.flex.gap-4');
      expect(rows.length).toBeGreaterThanOrEqual(4);
    });
  });
});
