# Story 0-7: CI/CD Pipeline

## Story

**As a** developer,
**I want** automated build, test, and deployment,
**So that** code changes deploy reliably to Banner.

## Acceptance Criteria

**Given** I push to `main` branch
**When** GitHub Actions runs
**Then** the pipeline:
1. Runs linting (ESLint, Prettier check)
2. Runs type checking (tsc --noEmit)
3. Runs unit tests (Vitest)
4. Builds Docker image
5. Pushes to container registry
6. Deploys to Banner via SSH
7. Runs database migrations
8. Verifies health endpoint responds

**And** failed steps block deployment
**And** notifications sent to ntfy on success/failure

## Technical Notes

### Infrastructure
- Target: Banner (10.0.0.33)
- Docker context already configured
- SSH key in GitHub secrets
- ntfy endpoint for notifications

### GitHub Secrets Required
- `BANNER_SSH_KEY` - SSH private key for Banner access
- `BANNER_HOST` - Banner IP (10.0.0.33)
- `NTFY_TOPIC` - ntfy notification topic

## Tasks

- [ ] Create GitHub Actions workflow file
- [ ] Add lint and type check steps
- [ ] Add unit test step
- [ ] Add Docker build step
- [ ] Add SSH deployment step
- [ ] Add migration step
- [ ] Add health check verification
- [ ] Add ntfy notifications
- [ ] Test pipeline with a commit
