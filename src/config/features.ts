/**
 * Global feature flags.
 * Flip these to enable/disable features across the entire app.
 */
export const FEATURES = {
  /** Set to true when PayU credentials are configured and migration is run */
  PAYMENTS_ENABLED: false,
} as const;
