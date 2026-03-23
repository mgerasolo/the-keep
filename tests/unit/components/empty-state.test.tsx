/**
 * Empty State Component Tests
 * Tests for Story 0-9: Empty States & Loading Skeletons
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  EmptyState,
  EmptyProjects,
  EmptyFiles,
  EmptyChat,
  EmptyMemories,
  EmptySearch,
  EmptyTrash,
} from '@/components/ui/empty-state';

describe('EmptyState Components', () => {
  describe('EmptyState', () => {
    it('should render title', () => {
      render(<EmptyState title="No data" />);
      expect(screen.getByText('No data')).toBeInTheDocument();
    });

    it('should render description when provided', () => {
      render(<EmptyState title="No data" description="Try adding some content" />);
      expect(screen.getByText('Try adding some content')).toBeInTheDocument();
    });

    it('should render icon when provided', () => {
      render(<EmptyState title="Empty" icon="📁" />);
      expect(screen.getByText('📁')).toBeInTheDocument();
    });

    it('should render action button when provided', () => {
      const onClick = vi.fn();
      render(
        <EmptyState
          title="Empty"
          action={{ label: 'Add Item', onClick }}
        />
      );

      const button = screen.getByRole('button', { name: 'Add Item' });
      expect(button).toBeInTheDocument();

      fireEvent.click(button);
      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should not render action button when not provided', () => {
      render(<EmptyState title="Empty" />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('EmptyProjects', () => {
    it('should render projects empty state', () => {
      render(<EmptyProjects />);
      expect(screen.getByText('No projects yet')).toBeInTheDocument();
      expect(screen.getByText('📁')).toBeInTheDocument();
    });

    it('should render create button when callback provided', () => {
      const onCreate = vi.fn();
      render(<EmptyProjects onCreateProject={onCreate} />);

      const button = screen.getByRole('button', { name: 'Create Project' });
      fireEvent.click(button);
      expect(onCreate).toHaveBeenCalled();
    });

    it('should not render button when no callback', () => {
      render(<EmptyProjects />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });

  describe('EmptyFiles', () => {
    it('should render files empty state', () => {
      render(<EmptyFiles />);
      expect(screen.getByText('No files here')).toBeInTheDocument();
      expect(screen.getByText('📄')).toBeInTheDocument();
    });

    it('should render upload button when callback provided', () => {
      const onUpload = vi.fn();
      render(<EmptyFiles onUploadFile={onUpload} />);

      const button = screen.getByRole('button', { name: 'Upload Files' });
      fireEvent.click(button);
      expect(onUpload).toHaveBeenCalled();
    });
  });

  describe('EmptyChat', () => {
    it('should render chat empty state', () => {
      render(<EmptyChat />);
      expect(screen.getByText('Start a conversation')).toBeInTheDocument();
      expect(screen.getByText('💬')).toBeInTheDocument();
    });
  });

  describe('EmptyMemories', () => {
    it('should render memories empty state', () => {
      render(<EmptyMemories />);
      expect(screen.getByText('No memories yet')).toBeInTheDocument();
      expect(screen.getByText('🧠')).toBeInTheDocument();
    });

    it('should render add button when callback provided', () => {
      const onCreate = vi.fn();
      render(<EmptyMemories onCreateMemory={onCreate} />);

      const button = screen.getByRole('button', { name: 'Add Memory' });
      fireEvent.click(button);
      expect(onCreate).toHaveBeenCalled();
    });
  });

  describe('EmptySearch', () => {
    it('should render search empty state with query', () => {
      render(<EmptySearch query="test query" />);
      expect(screen.getByText('No results found')).toBeInTheDocument();
      expect(screen.getByText(/test query/)).toBeInTheDocument();
      expect(screen.getByText('🔍')).toBeInTheDocument();
    });
  });

  describe('EmptyTrash', () => {
    it('should render trash empty state', () => {
      render(<EmptyTrash />);
      expect(screen.getByText('Trash is empty')).toBeInTheDocument();
      expect(screen.getByText('🗑️')).toBeInTheDocument();
    });
  });
});
