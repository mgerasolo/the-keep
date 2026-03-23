/**
 * Structured Logging Utility
 * Provides JSON-formatted logs compatible with Loki/Grafana
 */

import pino from 'pino';

// Log levels: trace < debug < info < warn < error < fatal
type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

const LOG_LEVEL = (process.env.LOG_LEVEL as LogLevel) ?? 'info';

/**
 * Base logger configuration
 */
const baseLogger = pino({
  level: LOG_LEVEL,
  formatters: {
    level: (label) => ({ level: label }),
    bindings: (bindings) => ({
      pid: bindings.pid,
      hostname: bindings.hostname,
      service: 'the-keep',
      version: process.env.NEXT_PUBLIC_APP_VERSION ?? '0.1.0',
    }),
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  // In production, output JSON; in dev, use pino-pretty via transport
  ...(process.env.NODE_ENV === 'production'
    ? {}
    : {
        transport: {
          target: 'pino-pretty',
          options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname',
          },
        },
      }),
});

/**
 * Create a child logger with context
 */
export function createLogger(context: Record<string, unknown> = {}) {
  return baseLogger.child(context);
}

/**
 * Default logger instance
 */
export const logger = createLogger();

/**
 * Request context for logging
 */
export interface RequestLogContext {
  method: string;
  path: string;
  traceId: string;
  userId?: string;
  userAgent?: string;
  ip?: string;
}

/**
 * Create a request-scoped logger
 */
export function createRequestLogger(ctx: RequestLogContext) {
  return createLogger({
    request: {
      method: ctx.method,
      path: ctx.path,
      traceId: ctx.traceId,
      userId: ctx.userId,
      userAgent: ctx.userAgent,
      ip: ctx.ip,
    },
  });
}

/**
 * Log request completion with timing
 */
export function logRequestComplete(
  requestLogger: ReturnType<typeof createLogger>,
  status: number,
  durationMs: number,
  error?: Error
) {
  const logData = {
    response: {
      status,
      durationMs,
    },
  };

  if (error) {
    requestLogger.error(
      {
        ...logData,
        err: {
          message: error.message,
          name: error.name,
          stack: error.stack,
        },
      },
      `Request failed: ${error.message}`
    );
  } else if (status >= 500) {
    requestLogger.error(logData, `Request completed with server error`);
  } else if (status >= 400) {
    requestLogger.warn(logData, `Request completed with client error`);
  } else {
    requestLogger.info(logData, `Request completed`);
  }
}

/**
 * Sanitize request body for logging (remove sensitive fields)
 */
export function sanitizeBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') {
    return body;
  }

  const sensitiveKeys = [
    'password',
    'token',
    'secret',
    'apikey',
    'api_key',
    'authorization',
    'cookie',
    'session',
  ];

  const sanitized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    if (sensitiveKeys.some((k) => key.toLowerCase().includes(k.toLowerCase()))) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeBody(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

export default logger;
