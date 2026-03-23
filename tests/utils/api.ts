/**
 * API Testing Utilities
 * Helpers for testing API routes
 */

import { NextRequest } from 'next/server';

/**
 * Create a mock NextRequest for testing API routes
 */
export function createMockRequest(
  url: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
  } = {}
): NextRequest {
  const { method = 'GET', headers = {}, body } = options;

  const requestInit: RequestInit = {
    method,
    headers: new Headers({
      'Content-Type': 'application/json',
      ...headers,
    }),
  };

  if (body && method !== 'GET') {
    requestInit.body = JSON.stringify(body);
  }

  return new NextRequest(new URL(url, 'http://localhost:3000'), requestInit as Parameters<typeof NextRequest>[1]);
}

/**
 * Parse JSON response from API route
 */
export async function parseResponse<T>(response: Response): Promise<T> {
  const text = await response.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Failed to parse response: ${text}`);
  }
}

/**
 * Assert API response status and return parsed body
 */
export async function assertResponse<T>(
  response: Response,
  expectedStatus: number
): Promise<T> {
  if (response.status !== expectedStatus) {
    const body = await response.text();
    throw new Error(
      `Expected status ${expectedStatus}, got ${response.status}. Body: ${body}`
    );
  }
  return parseResponse<T>(response);
}
