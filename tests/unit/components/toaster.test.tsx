/**
 * Toast Component Tests
 * Tests for Story 0-5: Toast & Error Handling Framework
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { toast, showToast } from '@/components/ui/toaster';

// Mock sonner
vi.mock('sonner', () => ({
  Toaster: () => null,
  toast: {
    success: vi.fn((message, options) => ({ message, options })),
    error: vi.fn((message, options) => ({ message, options })),
    warning: vi.fn((message, options) => ({ message, options })),
    info: vi.fn((message, options) => ({ message, options })),
    dismiss: vi.fn(),
  },
}));

describe('Toast System', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('showToast function', () => {
    it('should show success toast', () => {
      const result = showToast('success', 'Operation completed');
      expect(result).toBeDefined();
    });

    it('should show error toast', () => {
      const result = showToast('error', 'Something went wrong');
      expect(result).toBeDefined();
    });

    it('should show warning toast', () => {
      const result = showToast('warning', 'Please be careful');
      expect(result).toBeDefined();
    });

    it('should show info toast', () => {
      const result = showToast('info', 'Here is some information');
      expect(result).toBeDefined();
    });

    it('should handle description option', () => {
      const result = showToast('success', 'Title', {
        description: 'Additional details',
      });
      expect(result).toBeDefined();
    });

    it('should handle action option', () => {
      const actionFn = vi.fn();
      const result = showToast('info', 'Update available', {
        action: {
          label: 'Update',
          onClick: actionFn,
        },
      });
      expect(result).toBeDefined();
    });

    it('should handle custom duration', () => {
      const result = showToast('success', 'Quick toast', {
        duration: 1000,
      });
      expect(result).toBeDefined();
    });
  });

  describe('toast convenience functions', () => {
    it('should have success function', () => {
      expect(typeof toast.success).toBe('function');
      const result = toast.success('Success!');
      expect(result).toBeDefined();
    });

    it('should have error function', () => {
      expect(typeof toast.error).toBe('function');
      const result = toast.error('Error!');
      expect(result).toBeDefined();
    });

    it('should have warning function', () => {
      expect(typeof toast.warning).toBe('function');
      const result = toast.warning('Warning!');
      expect(result).toBeDefined();
    });

    it('should have info function', () => {
      expect(typeof toast.info).toBe('function');
      const result = toast.info('Info!');
      expect(result).toBeDefined();
    });

    it('should have dismiss function', () => {
      expect(typeof toast.dismiss).toBe('function');
    });
  });

  describe('toast types', () => {
    it('should export ToastType', async () => {
      // Type test - this verifies the type exists
      const type: import('@/components/ui/toaster').ToastType = 'success';
      expect(['success', 'error', 'warning', 'info']).toContain(type);
    });
  });
});
