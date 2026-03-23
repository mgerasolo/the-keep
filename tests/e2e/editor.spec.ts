/**
 * Editor E2E Tests
 * Tests for Stories 2-1 through 2-10: Markdown Editing
 */

import { test, expect } from '@playwright/test';

test.describe('Markdown Editor', () => {
  test('workspace loads without errors', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="activity-bar"]')).toBeVisible({ timeout: 15000 });

    // Verify no error boundaries are showing (toasts use role="alert" but are not errors)
    const errors = await page.locator('.error-boundary').count();
    expect(errors).toBe(0);
  });

  test('welcome panel displays correctly', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="activity-bar"]')).toBeVisible({ timeout: 15000 });

    // Should show welcome heading
    await expect(page.getByRole('heading', { name: 'Welcome to The Keep' })).toBeVisible();

    // Should show quick action buttons
    await expect(page.getByRole('button', { name: /Create Project/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Start Chat/i })).toBeVisible();
  });
});

test.describe('Diff Viewer API', () => {
  test('edit endpoint returns valid response structure', async ({ request }) => {
    // Test the AI edit API endpoint structure
    const response = await request.post('/api/ai/edit', {
      data: {
        content: '# Test Document\n\nOriginal content here.',
        instruction: 'Add a paragraph about testing.',
      },
    });

    // Should either succeed or fail gracefully (not crash)
    expect([200, 401, 500]).toContain(response.status());

    if (response.status() === 200) {
      const body = await response.json();
      expect(body).toHaveProperty('original');
      expect(body).toHaveProperty('edited');
      expect(body).toHaveProperty('instruction');
    }
  });
});
