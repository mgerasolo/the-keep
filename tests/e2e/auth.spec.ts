/**
 * Auth E2E Tests
 * Tests for Story 0-3: Auth-Ready Architecture
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load app without login screen', async ({ page }) => {
    await page.goto('/');

    // Should see the main page, not a login form
    await expect(page.locator('h1')).toContainText('The Keep');

    // Should NOT see login form elements
    await expect(page.locator('input[type="password"]')).not.toBeVisible();
    await expect(page.locator('button:has-text("Login")')).not.toBeVisible();
  });

  test('should display current user info', async ({ page }) => {
    await page.goto('/');

    // Should show the seeded user's name (exact match to avoid email)
    await expect(page.getByText('Matt', { exact: true })).toBeVisible();
    await expect(page.getByText('matt@gerasolo.com')).toBeVisible();
  });

  test('should set session cookie on first visit', async ({ page, context }) => {
    // Clear all cookies first
    await context.clearCookies();

    // Visit the page
    await page.goto('/');

    // Check that session cookie was set
    const cookies = await context.cookies();
    const sessionCookie = cookies.find(c => c.name === 'session');

    expect(sessionCookie).toBeDefined();
    expect(sessionCookie?.httpOnly).toBe(true);
    expect(sessionCookie?.sameSite).toBe('Lax');

    // Parse and verify session content
    const session = JSON.parse(decodeURIComponent(sessionCookie!.value));
    expect(session.userId).toBe('e08cc546-fa29-4559-93f9-ceb658f66668');
    expect(session.createdAt).toBeGreaterThan(0);
  });

  test('should persist session across page reloads', async ({ page, context }) => {
    // First visit
    await page.goto('/');

    // Get initial session
    const cookies1 = await context.cookies();
    const session1 = cookies1.find(c => c.name === 'session');

    // Reload page
    await page.reload();

    // Get session after reload
    const cookies2 = await context.cookies();
    const session2 = cookies2.find(c => c.name === 'session');

    // Session should persist (same value)
    expect(session2?.value).toBe(session1?.value);

    // User info should still be visible
    await expect(page.getByText('Matt', { exact: true })).toBeVisible();
  });

  test('should include trace ID in response headers', async ({ page }) => {
    const response = await page.goto('/');

    // Check for trace ID header
    const traceId = response?.headers()['x-trace-id'];
    expect(traceId).toBeDefined();
    expect(traceId).toMatch(/^[0-9a-f-]{36}$/); // UUID format
  });
});
