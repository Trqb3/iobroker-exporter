/// <reference types="@iobroker/types" />

import http, { IncomingMessage } from 'node:http';
import { config } from '../../lib/setup';

export function fetchJSON<T = unknown>(path: string): Promise<T> {
    return new Promise((resolve: (value: T) => void, reject: (reason?: any) => void): void => {
        const url: string = `http://${config.IOBROKER_HOST}:${config.REST_API_PORT}${path}`;
        http.get(url, (res: IncomingMessage): void => {
            let data: string = '';

            res.on('data', (chunk: any): string => data += chunk);
            res.on('end', (): void => {
                try {
                    resolve(JSON.parse(data));
                } catch (error) {
                    reject(error);
                }
            });
        });
    });
}