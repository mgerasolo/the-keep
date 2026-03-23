/**
 * Workspace E2E Tests
 * Tests for Stories 1-1 through 1-6: Workspace Layout and File Management
 */

import { test, expect } from '@playwright/test';

test.describe('Workspace Layout', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for workspace to fully load
    await expect(page.locator('[data-testid="activity-bar"]')).toBeVisible({ timeout: 15000 });
  });

  test('displays activity bar with projects section', async ({ page }) => {
    // Activity bar should be visible
    const activityBar = page.locator('[data-testid="activity-bar"]');
    await expect(activityBar).toBeVisible();

    // New project button should be visible
    await expect(page.locator('[data-testid="new-project-action"]')).toBeVisible();
  });

  test('displays global action buttons', async ({ page }) => {
    // AI Chat button
    await expect(page.locator('[data-testid="ai-action"]')).toBeVisible();

    // Search button
    await expect(page.locator('[data-testid="search-action"]')).toBeVisible();

    // Knowledge button
    await expect(page.locator('[data-testid="knowledge-action"]')).toBeVisible();

    // Settings button
    await expect(page.locator('[data-testid="settings-action"]')).toBeVisible();
  });

  test('opens AI chat panel when AI button clicked', async ({ page }) => {
    // Click AI action button
    await page.locator('[data-testid="ai-action"]').click();

    // AI Chat panel tab should appear (use dockview tab content selector)
    await expect(page.locator('.dv-default-tab-content:has-text("AI Chat")')).toBeVisible({ timeout: 5000 });
  });

  test('can open new project modal', async ({ page }) => {
    // Click new project button
    await page.locator('[data-testid="new-project-action"]').click();

    // Modal should appear with project form (look for modal dialog)
    await expect(page.locator('[role="dialog"]')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Project Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="activity-bar"]')).toBeVisible({ timeout: 15000 });
  });

  test('can open and close project modal', async ({ page }) => {
    // Click new project button
    await page.locator('[data-testid="new-project-action"]').click();

    // Wait for modal
    const modal = page.locator('[role="dialog"]');
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Should have a name input field
    await expect(page.locator('input#name, input[placeholder*="name" i]')).toBeVisible({ timeout: 5000 });

    // Close modal by clicking cancel or pressing escape
    await page.keyboard.press('Escape');

    // Modal should close
    await expect(modal).not.toBeVisible({ timeout: 5000 });
  });
});

test.describe('File Browser', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('[data-testid="activity-bar"]')).toBeVisible({ timeout: 15000 });
  });

  test('displays Files tab in dockview', async ({ page }) => {
    // Files tab should be visible in the dockview panel
    await expect(page.locator('.dv-default-tab-content:has-text("Files")')).toBeVisible({ timeout: 5000 });
  });

  test('shows file browser prompt when no project selected', async ({ page }) => {
    // Should show "Select a project to view files" message
    await expect(page.getByText('Select a project to view files')).toBeVisible({ timeout: 5000 });
  });
});
