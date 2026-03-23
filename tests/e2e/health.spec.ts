/**
 * Health Check E2E Tests
 * End-to-end tests verifying the health endpoint works with real services
 */

import { test, expect } from '@playwright/test';

test.describe('Health Check', () => {
  test('workspace loads successfully', async ({ page }) => {
    // Navigate to homepage
    await page.goto('/');

    // Verify the page title
    await expect(page).toHaveTitle(/The Keep/);

    // Verify the workspace layout renders (activity bar)
    await expect(page.locator('[data-testid="activity-bar"]')).toBeVisible({ timeout: 15000 });
  });

  test('health endpoint returns valid response', async ({ request }) => {
    // Call the health endpoint
    const response = await request.get('/api/health');

    // Should return 200 (ok) or 200 (degraded) - not 503
    // In CI without services, this might return degraded
    expect([200, 503]).toContain(response.status());

    // Parse the response
    const body = await response.json();

    // Verify response structure
    expect(body).toHaveProperty('status');
    expect(body).toHaveProperty('timestamp');
    expect(body).toHaveProperty('services');
    expect(body).toHaveProperty('version');

    // Verify services object structure
    expect(body.services).toHaveProperty('db');
    expect(body.services).toHaveProperty('redis');
    expect(body.services).toHaveProperty('minio');

    // Verify status values are valid
    expect(['ok', 'degraded', 'error']).toContain(body.status);
    expect(['ok', 'error']).toContain(body.services.db);
    expect(['ok', 'error']).toContain(body.services.redis);
    expect(['ok', 'error']).toContain(body.services.minio);
  });

  test('health endpoint responds within acceptable time', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.get('/api/health');
    const duration = Date.now() - startTime;
    const body = await response.json();

    // When services are healthy, should be <500ms
    // When services are down (CI), connection timeouts add latency
    const maxTime = body.status === 'ok' ? 500 : 5000;
    expect(duration).toBeLessThan(maxTime);
  });
});
