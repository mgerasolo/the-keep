# Story 0-6: Logging & Observability

## Story

**As a** developer,
**I want** structured logging and error tracking from day one,
**So that** I can debug issues in production.

## Acceptance Criteria

**Given** the app is running on Banner
**When** I check observability tools
**Then** I can see:
- Structured logs in Loki (JSON format with timestamp, level, message, context)
- Errors tracked in Sentry with stack traces
- Request tracing with `X-Trace-ID` header propagation

**And** every API request logs: method, path, duration, status, user_id
**And** errors include context: user, route, request body (sanitized)
**And** log levels configurable via environment variable

## Technical Notes

### Infrastructure
- Loki endpoint: Coulson (10.0.0.28)
- Sentry: Optional for MVP, can add later
- Log transport: Direct to Loki via HTTP or Docker log driver

### Implementation
1. Create structured logger utility (pino or winston)
2. Add middleware for request logging
3. Configure log levels via LOG_LEVEL env var
4. Add Docker log labels for Loki collection

## Tasks

- [ ] Create logger utility with JSON formatting
- [ ] Add request logging middleware
- [ ] Configure log levels via environment
- [ ] Add trace ID propagation
- [ ] Update Docker Compose with Loki labels
- [ ] Test logs appear in Grafana
