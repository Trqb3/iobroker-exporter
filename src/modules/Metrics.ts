/// <reference types="@iobroker/types" />

import { globalStates } from '../lib/setup';
import { CustomError, ErrorCodes } from '../lib/errors';
import Logger from '../lib/util/Logger';
import { fetchJSON } from './helper/fetchJSON';
import { loadObjectMetadata } from './helper/loadObjectMetadata';
import { escapeLabel } from "./helper/escapeLabel";
import { mapToUnifiedMetric } from './helper/mapToUnifiedMetric';

const logger = new Logger();


export function generateMetrics(): string {
    let output: string = '';

    for (const [_id, metric] of Object.entries(globalStates.metrics)) {
        const filteredLabels: string = Object.entries(metric.labels)
            .filter(([_k, v]: [string, unknown]): boolean => v !== undefined && v !== '' && v !== 'undefined')
            .map(([k, v]: [string, unknown]): string => `${k}="${v}"`)
            .join(',');

        output += `${metric.name}{${filteredLabels}} ${metric.value}\n`;
    }

    return output;
}

export async function updateMetrics(): Promise<void> {
    if (!globalStates.cacheLoaded) await loadObjectMetadata();

    try {
        let metricCount: number = 0;
        let skippedCount: number = 0;

        const states: Record<string, ioBroker.State> = await fetchJSON('/v1/states?filter=*');

        for (const [id, state] of Object.entries(states)) {
            if (!state || state.val === undefined) continue;

            const value: ioBroker.StateValue = state.val;

            if (typeof value === 'string' && isNaN(parseFloat(value))) {
                skippedCount++;
                continue;
            }

            const numValue: number = typeof value === 'boolean' ? (value ? 1 : 0) : parseFloat(value as string);

            const mapped = mapToUnifiedMetric(id);
            const metricName: string = mapped.metricName;

            if (!metricName) {
                skippedCount++;
                continue;
            }


            const meta: any = globalStates.objectCache[id] || {};
            const labels = {
                ...mapped.labels,
                name: escapeLabel(meta.name || ''),
                location: meta.location || mapped.labels.location,
                room: meta.room || mapped.labels.room
            }

            globalStates.metrics[id] = {
                name: metricName,
                value: numValue,
                labels: labels
            }
            metricCount++;
        }

        logger.write(0, `Updated ${metricCount} metrics (skipped ${skippedCount} non-numeric values)`);
    } catch (error) {
        throw new CustomError(ErrorCodes.MetricsUpdateFailed);
    }
}