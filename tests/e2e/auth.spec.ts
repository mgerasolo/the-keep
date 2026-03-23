/**
 * Auth E2E Tests
 * Tests for Story 0-3: Auth-Ready Architecture
 */

import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('should load workspace without login screen', async ({ page }) => {
    await page.goto('/');

    // Should see the workspace layout, not a login form
    await expect(page.locator('[data-testid="activity-bar"]')).toBeVisible({ timeout: 15000 });

    // Should NOT see login form elements
    await expect(page.locator('input[type="password"]')).not.toBeVisible();
    await expect(page.locator('button:has-text("Login")')).not.toBeVisible();
  });

  test('should display activity bar with actions', async ({ page }) => {
    await page.goto('/');

    // Wait for workspace to load
    await expect(page.locator('[data-testid="activity-bar"]')).toBeVisible({ timeout: 15000 });

    // Should show AI action button
    await expect(page.locator('[data-testid="ai-action"]')).toBeVisible();

    // Should show settings action button
    await expect(page.locator('[data-testid="settings-action"]')).toBeVisible();
  });

  test('should include trace ID in response headers', async ({ page }) => {
    const response = await page.goto('/');

    // Check for trace ID header
    const traceId = response?.headers()['x-trace-id'];
    expect(traceId).toBeDefined();
    expect(traceId).toMatch(/^[0-9a-f-]{36}$/); // UUID format
  });
});
