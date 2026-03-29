import * as Sentry from '@sentry/react';

const DSN = import.meta.env.VITE_SENTRY_DSN as string | undefined;

let initialized = false;

export function initSentry(): void {
  if (initialized || !DSN) return;
  Sentry.init({
    dsn: DSN,
    environment: import.meta.env.MODE,
    enabled: import.meta.env.PROD,
    tracesSampleRate: 0.1,
    beforeSend(event) {
      if (import.meta.env.DEV) return null;
      return event;
    },
  });
  initialized = true;
}

export function captureError(error: unknown, context?: Record<string, any>): void {
  if (!initialized) {
    console.error(error);
    return;
  }
  Sentry.captureException(error, context ? { extra: context } : undefined);
}

export function captureWarning(message: string, context?: Record<string, any>): void {
  if (!initialized) {
    console.warn(message);
    return;
  }
  Sentry.captureMessage(message, { level: 'warning', extra: context });
}

export { Sentry };
