export enum ErrorCodes {
    InvalidType = 'InvalidType',
    MissingArgument = 'MissingArgument',

    // Config (lib/setup.ts)
    InvalidPort = 'InvalidPort',
    InvalidScrapeInterval = 'MissingScrapeIntervalUnit',
    ScrapeIntervalTooShort = 'ScrapeIntervalTooShort',

    // Metrics (modules/Metrics.ts)
    MetricsUpdateFailed = 'MetricsUpdateFailed',

    // Helper (modules/helper/)
    LoadObjectMetadataFailed = 'LoadObjectMetadataFailed',
}