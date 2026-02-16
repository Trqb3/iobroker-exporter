import ms, { StringValue } from 'ms';
import { CustomError, ErrorCodes } from './errors';

interface Config {
    IOBROKER_HOST: string;
    REST_API_PORT: number;
    EXPORTER_PORT: number;
    SCRAPE_INTERVAL: number;
}

interface State {
    objectCache: Record<string, any>;
    cacheLoaded: boolean;
    metrics: Record<string, any>;
}

export const globalStates: State = {
    objectCache: {},
    cacheLoaded: false,
    metrics: {}
}

export const config: Config = {
    IOBROKER_HOST: process.env.IOBROKER_HOST || 'localhost',
    REST_API_PORT: validatePort(process.env.REST_API_PORT || '8093', 'REST_API_PORT'),
    EXPORTER_PORT: validatePort(process.env.EXPORTER_PORT || '9092', 'EXPORTER_PORT'),
    SCRAPE_INTERVAL: validateScrapeInterval(process.env.SCRAPE_INTERVAL || '30s')
}


function validatePort(value: string, name: string): number {
    const port: number = Number(value);

    if (isNaN(port) || port <= 1 || port > 65535) {
        throw new CustomError(ErrorCodes.InvalidPort, name);
    }

    return port;
}

function validateScrapeInterval(value: string): number {
    if (/^\d+$/.test(value)) {
        throw new CustomError(ErrorCodes.InvalidScrapeInterval);
    }

    const interval: number = ms(value as StringValue);
    if (interval < 1000) {
        throw new CustomError(ErrorCodes.ScrapeIntervalTooShort);
    }

    return interval;
}