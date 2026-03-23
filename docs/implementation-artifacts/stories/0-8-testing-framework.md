# Story 0-8: Testing Framework

## Story

**As a** developer,
**I want** testing infrastructure in place,
**So that** I can write tests as I build features.

## Acceptance Criteria

**Given** I want to write tests
**When** I run test commands
**Then** I can:
- Run unit tests: `npm run test` (Vitest)
- Run E2E tests: `npm run test:e2e` (Playwright)
- Generate coverage report: `npm run test:coverage`

**And** test utilities exist for:
- Mocking tRPC context
- Rendering components with providers
- Database test fixtures
- API request helpers

**And** CI runs tests on every PR

## Status

Most infrastructure already in place:
- [x] Vitest configured
- [x] Playwright configured
- [x] Coverage command exists
- [x] CI runs tests on PR
- [ ] Test utilities (render with providers, tRPC mocks, fixtures)

## Tasks

- [ ] Create test render utility with providers
- [ ] Create tRPC test helpers
- [ ] Create database fixture utilities
- [ ] Document test patterns in README
