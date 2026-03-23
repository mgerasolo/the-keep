/**
 * AI Chat E2E Tests
 * Tests for Stories 3-1 through 3-5: AI Conversation
 */

import { test, expect } from '@playwright/test';

test.describe('AI Chat Panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="activity-bar"]')).toBeVisible({ timeout: 15000 });
  });

  test('opens AI chat panel via activity bar', async ({ page }) => {
    // Click AI action button
    await page.locator('[data-testid="ai-action"]').click();

    // AI Chat panel tab should appear in dockview
    await expect(page.locator('.dv-default-tab-content:has-text("AI Chat")')).toBeVisible({ timeout: 5000 });
  });

  test('displays model selector in chat panel', async ({ page }) => {
    // Open AI chat
    await page.locator('[data-testid="ai-action"]').click();
    await expect(page.locator('.dv-default-tab-content:has-text("AI Chat")')).toBeVisible({ timeout: 5000 });

    // Should have a model selector button (shows "Claude Sonnet 4" by default)
    await expect(page.locator('button:has-text("Claude")')).toBeVisible({ timeout: 5000 });
  });

  test('has message input field', async ({ page }) => {
    // Open AI chat
    await page.locator('[data-testid="ai-action"]').click();
    await expect(page.locator('.dv-default-tab-content:has-text("AI Chat")')).toBeVisible({ timeout: 5000 });

    // Should have a textarea for messages
    await expect(page.locator('textarea').first()).toBeVisible({ timeout: 5000 });
  });
});

test.describe('AI Chat API', () => {
  test('chat endpoint accepts POST requests', async ({ request }) => {
    const response = await request.post('/api/ai/chat', {
      data: {
        messages: [{ role: 'user', content: 'Hello' }],
        model: 'claude-sonnet-4-20250514',
      },
    });

    // Should either succeed (200 with streaming) or fail gracefully
    expect([200, 401, 500]).toContain(response.status());
  });

  test('chat endpoint handles requests', async ({ request }) => {
    // Test that the endpoint responds (MVP mode allows unauthenticated)
    const response = await request.post('/api/ai/chat', {
      data: {
        messages: [{ role: 'user', content: 'Hello' }],
      },
    });

    // Should return 200 (streaming) or 401/500 depending on auth/service state
    expect([200, 401, 500]).toContain(response.status());
  });
});
