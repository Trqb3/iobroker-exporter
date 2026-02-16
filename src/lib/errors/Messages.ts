import { ErrorCodes } from './ErrorCodes';

export const Messages: Record<ErrorCodes, string> = {
    [ErrorCodes.InvalidType]: 'Provided type is invalid',
    [ErrorCodes.MissingArgument]: 'Missing required argument',

    // Config (lib/setup.ts)
    [ErrorCodes.InvalidPort]: '%s must be a number between 1 and 65535',
    [ErrorCodes.InvalidScrapeInterval]: 'SCRAPE_INTERVAL must include time unit (e.g., "30s", "2m", "1h")',
    [ErrorCodes.ScrapeIntervalTooShort]: 'SCRAPE_INTERVAL must be at least 1s (1000ms)',

    // Metrics (modules/Metrics.ts)
    [ErrorCodes.MetricsUpdateFailed]: 'Failed to update metrics',

    // Helper (modules/helper/)
    [ErrorCodes.LoadObjectMetadataFailed]: 'Failed to load object metadata',
};